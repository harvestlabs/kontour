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
import Node from "./Node.model";
import User from "./User.model";

export interface NodeAccountData {
  account: {
    address: string;
    privateKey: string;
  };
  password: string;
}

@Table({
  timestamps: true,
  tableName: "node_accounts",
  underscored: true,
})
export default class NodeAccount extends Model {
  static User;
  static Node;

  @Default(v4)
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;
  @CreatedAt
  created_at!: Date;
  @UpdatedAt
  updated_at!: Date;

  @Column(DataType.JSON)
  data: NodeAccountData;

  @Column(DataType.STRING)
  node_id: string;

  @Column(DataType.STRING)
  user_id: string;

  @BelongsTo(() => User, "node_id")
  user: User;

  @BelongsTo(() => Node, "node_id")
  node: Node;

  static async getAll(userId: string, nodeId: string): Promise<NodeAccount[]> {
    const existing = await NodeAccount.findAll({
      where: {
        user_id: userId,
        node_id: nodeId,
      },
    });
    return existing;
  }

  static async generateNew(
    userId: string,
    nodeId: string
  ): Promise<NodeAccount> {
    const { web3, account } = await local(nodeId);
    const newAcc = web3.eth.accounts.create();

    const result = [];
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    Array.from(Array(24)).forEach((i) => {
      result.push(
        characters.charAt(Math.floor(Math.random() * charactersLength))
      );
    });
    const password = result.join("");

    await web3.eth.personal.importRawKey(newAcc.privateKey, password);
    await Node.airdropAddress(nodeId, newAcc.address, 1);
    return await NodeAccount.create({
      data: {
        account: {
          address: newAcc.address,
          privateKey: newAcc.privateKey,
        },
        password: password,
      },
      user_id: userId,
      node_id: nodeId,
    });
  }
}
