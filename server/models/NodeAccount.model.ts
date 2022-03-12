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
import Node from "./Node.model";
import User from "./User.model";

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
  account: any;

  @Column(DataType.STRING)
  node_id: string;

  @Column(DataType.STRING)
  user_id: string;

  @BelongsTo(() => User, "node_id")
  user: User;

  @BelongsTo(() => Node, "node_id")
  node: Node;
}
