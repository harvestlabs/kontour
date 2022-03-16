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
  BeforeCreate,
  BeforeUpdate,
} from "sequelize-typescript";
import { v4 } from "uuid";
import User from "./User.model";

@Table({
  timestamps: true,
  tableName: "github_data",
  underscored: true,
})
export default class GithubData extends Model {
  static User;

  @Default(v4)
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;

  @Column(DataType.INTEGER)
  github_app_install_id: number;

  @Column(DataType.STRING)
  github_handle: string;

  @Column(DataType.STRING)
  github_id: string;

  @CreatedAt
  created_at!: Date;
  @UpdatedAt
  updated_at!: Date;

  @ForeignKey(() => User)
  @Column(DataType.STRING)
  user_id: string;

  @BelongsTo(() => User, "user_id")
  user: User;
}
