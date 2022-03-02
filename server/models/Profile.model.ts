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

@Table({
  timestamps: true,
  tableName: "profiles",
  underscored: true,
})
export default class Profile extends Model {
  static User;

  @Default(v4)
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;
  @CreatedAt
  created_at!: Date;
  @UpdatedAt
  updated_at!: Date;

  @Column(DataType.STRING)
  twitter_handle: string;

  @Column(DataType.STRING)
  image_url: string;

  @ForeignKey(() => User)
  @Column
  user_id: string;

  @BelongsTo(() => User, "user_id")
  user: User;
}
