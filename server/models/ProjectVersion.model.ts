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
  AfterCreate,
  HasMany,
} from "sequelize-typescript";
import { v4 } from "uuid";
import Instance from "./Instance.model";
import Project from "./Project.model";

export enum ProjectVersionStatus {
  UNKNOWN = 0,
  DRAFT = 1,
  PUBLISHED = 2,
}

@Table({
  timestamps: true,
  tableName: "project_versions",
  underscored: true,
})
export default class ProjectVersion extends Model {
  static Project;

  @Default(v4)
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;
  @CreatedAt
  created_at!: Date;
  @UpdatedAt
  updated_at!: Date;

  /*
   * {
   *   contract_source_ids: id[]
   * }
   */
  @Column(DataType.JSON)
  data: any;

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.INTEGER)
  status: ProjectVersionStatus;

  @Column(DataType.STRING)
  project_id: string;

  @BelongsTo(() => Project, "project_id")
  project: Project;
  @HasMany(() => Instance, "project_version_id")
  instances: Instance[];
}
