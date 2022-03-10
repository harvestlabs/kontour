import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  HasMany,
  Default,
  DataType,
  PrimaryKey,
  HasOne,
  AfterCreate,
} from "sequelize-typescript";
import { v4 } from "uuid";
import Web3PublicKey from "./Web3PublicKey.model";
import Profile from "./Profile.model";
import Project from "./Project.model";
import { createFolder } from "../utils/s3";
import ApiKey from "./ApiKey.model";

@Table({
  timestamps: true,
  tableName: "users",
  underscored: true,
})
export default class User extends Model {
  static Profile;
  static PublicKey;
  static Projects; // the projects this user owns

  @Default(v4)
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;

  @Default(0)
  @Column
  flags!: number;

  @CreatedAt
  created_at!: Date;
  @UpdatedAt
  updated_at!: Date;

  @HasMany(() => Project, "user_id")
  projects: Project[];

  @HasOne(() => Profile, "user_id")
  profile: Profile;

  @HasOne(() => Web3PublicKey, "user_id")
  public_key: Web3PublicKey;

  @HasOne(() => ApiKey, "user_id")
  api_key: ApiKey;

  @AfterCreate
  static async createProfileIfNotExists(instance) {
    if (!instance.profile) {
      await Profile.create({
        user_id: instance.id,
      });
    }
  }

  @AfterCreate
  static async createS3Folder(instance: Project) {
    await createFolder(instance.id);
  }
}
