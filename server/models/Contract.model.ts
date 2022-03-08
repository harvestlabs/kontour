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
import Node from "./Node.model";
import { getContractCode } from "../utils/etherscan";
import SimpleStorage from "../../contour/templates/SimpleStorage";
import {
  deployFromSource,
  deployfromTemplate,
} from "../../contour/deployer/deploy";
import ERC721Minter from "../../contour/templates/ERC721";
import ContractSource from "./ContractSource.model";
import Project from "./Project.model";

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
  tableName: "contracts",
  underscored: true,
})
export default class Contract extends Model {
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
  node_id: string;

  @Column(DataType.STRING)
  source: string;

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.JSON)
  abi: any;

  @BelongsTo(() => Node, "node_id")
  node: Node;

  static async importByAddressAndChain(
    address: string,
    chainId: number,
    projectId: string // The project that we are importing into
  ): Promise<Contract> {
    let source = await ContractSource.findOne({
      where: {
        address: address,
        chain_id: chainId,
      },
    });
    if (!source) {
      const { SourceCode, ABI, ContractName } = await getContractCode(
        address,
        chainId
      );
      source = await ContractSource.create({
        address: address,
        chain_id: chainId,
        abi: ABI,
        source: SourceCode,
        name: ContractName,
      });
    }
    return await Contract.createFromSource(source, projectId);
  }

  static async createFromTemplate(
    templateName: ContractTemplate,
    templateArgs: any,
    projectId: string
  ): Promise<Contract> {
    const project = await Project.findByPk(projectId, { include: Node });
    const toDeploy = new templateMapping[templateName](templateArgs);
    const results = await deployfromTemplate(toDeploy);
    const contract = await Contract.create({
      address: results.address,
      chain_id: project.node.data.chainId,
      abi: results.abi,
      source: results.source,
      node_id: project.node.id,
      name: toDeploy.name,
    });
    await ContractSource.create({
      address: contract.address,
      chain_id: contract.chain_id,
      abi: contract.abi,
      source: contract.source,
      name: toDeploy.name,
    });
    return contract;
  }

  static async createFromSource(
    cs: ContractSource,
    projectId: string
  ): Promise<Contract> {
    const project = await Project.findByPk(projectId, { include: Node });
    const results = await deployFromSource(cs.source, cs.name);
    const contract = await Contract.create({
      address: results.address,
      chain_id: project.node.data.chainId,
      abi: results.abi,
      source: results.source,
      node_id: project.node.id,
      name: cs.name,
    });
    return contract;
  }
}
