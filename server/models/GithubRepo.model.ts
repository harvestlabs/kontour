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
import GithubData from "./GithubData.model";
import User from "./User.model";

export enum DeployStatus {
  UNKNOWN = 0,
  IN_PROGRESS = 1,
  SUCCESS = 2,
  FAILED = 3,
}

export interface DeployData {
  buildCmd: string; // relative to buildDir
  buildDir: string; // relative to root of repo
  branch: string;
  // Quikdraw configs
  apiKey: string;
  type: string;
  truffleConfigPath: string;
  projectId: string;
  versionId: string;
}

@Table({
  timestamps: true,
  tableName: "github_repos",
  underscored: true,
})
export default class GithubRepo extends Model {
  static User;

  @Default(v4)
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;

  @Column(DataType.STRING)
  repo_name: string;

  @Column(DataType.STRING)
  handle: string;

  @Column(DataType.JSON)
  deploy_data: DeployData;

  @Default(0)
  @Column(DataType.INTEGER)
  deploy_status: DeployStatus;

  @ForeignKey(() => User)
  @Column(DataType.STRING)
  user_id: string;

  @CreatedAt
  created_at!: Date;
  @UpdatedAt
  updated_at!: Date;

  @BelongsTo(() => User, "user_id")
  user: User;

  async getInstallId(): Promise<number> {
    const data = await GithubData.findOne({
      where: {
        github_handle: this.handle,
      },
    });
    return data.github_app_install_id;
  }
}
