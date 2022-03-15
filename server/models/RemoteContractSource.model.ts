import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  Default,
  DataType,
  PrimaryKey,
  BelongsTo,
} from "sequelize-typescript";
import { v4 } from "uuid";
import fs from "fs";
import {
  TEMP_BIN,
  TEMP_JSON,
  tryCompile,
} from "../../contour/deployer/compile";
import { getBytecode, getContractCode } from "../utils/etherscan";
import SimpleStorage from "../../contour/templates/SimpleStorage";
import ERC721Minter from "../../contour/templates/ERC721";

export enum ContractTemplate {
  SIMPLE_STORAGE = "SimpleStorage",
  SIMPLE_ERC721 = "ERC721",
}
export const templateMapping = {
  [ContractTemplate.SIMPLE_STORAGE]: SimpleStorage,
  [ContractTemplate.SIMPLE_ERC721]: ERC721Minter,
};
@Table({
  timestamps: true,
  tableName: "remote_contract_sources",
  underscored: true,
})
export default class RemoteContractSource extends Model {
  @Default(v4)
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;
  @CreatedAt
  created_at!: Date;
  @UpdatedAt
  updated_at!: Date;

  @Column(DataType.STRING)
  address: string;

  @Column(DataType.INTEGER)
  chain_id: number;

  @Column(DataType.STRING)
  source: string;

  @Column(DataType.STRING)
  bytecode: string;

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.STRING)
  user_id: string;

  @Column(DataType.JSON)
  abi: any;

  static async importByAddressAndChain(
    address: string,
    chainId: number
  ): Promise<RemoteContractSource> {
    let source = await RemoteContractSource.findOne({
      where: {
        address: address,
        chain_id: chainId,
      },
    });
    if (source) {
      return source;
    }
    const { SourceCode, ABI, ContractName } = await getContractCode(
      address,
      chainId
    );
    source = await RemoteContractSource.create({
      address: address,
      chain_id: chainId,
      source: SourceCode,
      abi: JSON.parse(ABI),
      name: ContractName,
    });
    return await source.generateBytecode();
  }

  static async createFromTemplate(
    templateName: ContractTemplate,
    templateArgs: any
  ): Promise<RemoteContractSource> {
    const toDeploy = new templateMapping[templateName](templateArgs);
    const source = await RemoteContractSource.create({
      source: toDeploy.write(),
      name: toDeploy.name,
    });
    return await source.generateBytecodeLocal();
  }

  static async compileFromSource(
    source: string,
    contractName: string
  ): Promise<RemoteContractSource> {
    const result = await tryCompile(source);
    if (!result.success) {
      throw Error(result.message);
    }
    let abi = JSON.parse(
      fs
        .readFileSync(
          `${__dirname}/../abis/${TEMP_JSON(result.message, contractName)}`
        )
        .toString()
    );
    let bytecode = fs
      .readFileSync(
        `${__dirname}/../abis/${TEMP_BIN(result.message, contractName)}`
      )
      .toString();
    return await RemoteContractSource.create({
      abi: abi,
      bytecode: bytecode,
      name: contractName,
      source: source,
    });
  }

  async generateBytecodeLocal(): Promise<RemoteContractSource> {
    const result = await tryCompile(this.source);
    if (!result.success) {
      throw Error(result.message);
    }
    let abi = JSON.parse(
      fs
        .readFileSync(
          `${__dirname}/../abis/${TEMP_JSON(result.message, this.name)}`
        )
        .toString()
    );
    let bytecode = fs
      .readFileSync(
        `${__dirname}/../abis/${TEMP_BIN(result.message, this.name)}`
      )
      .toString();
    this.abi = abi;
    this.bytecode = bytecode;
    return await this.save();
  }

  async generateBytecode(): Promise<RemoteContractSource> {
    this.bytecode = await getBytecode(this.address, this.chain_id);
    return await this.save();
  }
}
