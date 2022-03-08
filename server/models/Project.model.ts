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
} from "sequelize-typescript";
import { v4 } from "uuid";
import User from "./User.model";
import Node from "./Node.model";

@Table({
  timestamps: true,
  tableName: "projects",
  underscored: true,
})
export default class Project extends Model {
  static User;

  @Default(v4)
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;
  @CreatedAt
  created_at!: Date;
  @UpdatedAt
  updated_at!: Date;

  @Column(DataType.JSON)
  data: any;

  @ForeignKey(() => User)
  @Column
  user_id: string;

  @ForeignKey(() => Node)
  @Column
  node_id: string;

  @BelongsTo(() => User, "user_id")
  user: User;
  @BelongsTo(() => Node, "node_id")
  node: Node;
}
