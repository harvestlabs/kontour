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
import bcrypt from "bcrypt-nodejs";
import User from "./User.model";

@Table({
  timestamps: true,
  tableName: "login_data",
  underscored: true,
})
export default class LoginData extends Model {
  static User;

  @PrimaryKey
  @ForeignKey(() => User)
  @Column(DataType.STRING)
  user_id: string;

  @Column(DataType.STRING)
  password: string;

  @Column(DataType.STRING)
  email: string;

  @Column(DataType.STRING)
  twitter_handle: string;
  @Column(DataType.STRING)
  twitter_id: string;

  @Column(DataType.STRING)
  github_handle: string;
  @Column(DataType.STRING)
  github_id: string;

  @CreatedAt
  created_at!: Date;
  @UpdatedAt
  updated_at!: Date;

  @BelongsTo(() => User, "user_id")
  user: User;

  @BeforeCreate
  @BeforeUpdate
  static saltPassword(instance: LoginData) {
    if (!instance.password) {
      return;
    }
    const salt = bcrypt.genSaltSync(10);
    instance.password = bcrypt.hashSync(instance.password, salt);
  }

  validPassword(toCheck: string) {
    return bcrypt.compareSync(toCheck, this.password);
  }
}
