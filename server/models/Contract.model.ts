import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  Default,
  DataType,
  PrimaryKey,
} from "sequelize-typescript";
import { v4 } from "uuid";
import { getContractABI } from "../utils/etherscan";
import SimpleStorage from "../../contour/templates/SimpleStorage";
import { deploy } from "../../contour/deployer/deploy";

export enum ContractTemplate {
  SIMPLE_STORAGE = "SimpleStorage",
}
const templateMapping = {
  [ContractTemplate.SIMPLE_STORAGE]: SimpleStorage,
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

  @Column(DataType.JSON)
  abi: any;

  static async createWithABI(
    address: string,
    chainId: number
  ): Promise<Contract> {
    const existing = await Contract.findOne({
      where: {
        address: address,
      },
    });
    if (existing) {
      return existing;
    }
    const abi = await getContractABI(address, chainId);
    if (abi) {
      return await Contract.create({
        address: address,
        chainId: chainId,
        abi: abi,
      });
    }
    return null;
  }

  static async createFromTemplate(
    templateName: ContractTemplate,
    templateArgs: any,
    chainId: number
  ): Promise<Contract> {
    const toDeploy = new templateMapping[templateName](templateArgs);
    const results = await deploy(toDeploy);
    return await Contract.create({
      address: results.address,
      chainId: chainId,
      abi: results.abi,
    });
  }
}
