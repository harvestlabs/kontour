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

  @Column(DataType.JSON)
  abi: any;

  static async createWithABI(address: string): Promise<Contract> {
    const existing = await Contract.findOne({
      where: {
        address: address,
      },
    });
    if (existing) {
      return existing;
    }
    const abi = await getContractABI(address);
    if (abi) {
      return await Contract.create({
        address: address,
        abi: abi,
      });
    }
    return null;
  }
}
