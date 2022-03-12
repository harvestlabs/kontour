import {
  Table,
  Column,
  Model,
  CreatedAt,
  BelongsTo,
  ForeignKey,
  UpdatedAt,
  Default,
  DataType,
  PrimaryKey,
  HasMany,
} from "sequelize-typescript";
import { v4 } from "uuid";
import { local } from "../utils/web3";
import Contract from "./Contract.model";
import Project from "./Project.model";

export interface NodeData {
  hostUrl: string;
  chainId: number;
}

@Table({
  timestamps: true,
  tableName: "nodes",
  underscored: true,
})
export default class Node extends Model {
  static Projects;
  static Contracts;

  @Default(v4)
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;
  @CreatedAt
  created_at!: Date;
  @UpdatedAt
  updated_at!: Date;

  @Column(DataType.JSON)
  data: NodeData;

  @HasMany(() => Project, "node_id")
  projects: Project[];

  @HasMany(() => Contract, "node_id")
  contracts: Contract[];

  static async getAvailable(): Promise<Node> {
    return Node.findOne();
  }

  static async airdropAddress(
    nodeId: string,
    address: string,
    amountInEth: number
  ) {
    const { web3, account } = await local(nodeId);
    const signed = await web3.eth.accounts.signTransaction(
      {
        from: account.address,
        to: address,
        value: web3.utils.toWei(amountInEth.toString(), "ether"),
        gas: web3.utils.toWei("0.03", "gwei"),
        gasPrice: web3.utils.toWei("20", "gwei"),
      },
      account.privateKey
    );
    const result = await web3.eth.sendSignedTransaction(signed.rawTransaction);
    return result;
  }
}
