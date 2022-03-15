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
  BeforeCreate,
} from "sequelize-typescript";
import { v4 } from "uuid";
import Contract from "./Contract.model";
import Instance, { InstanceStatus } from "./Instance.model";
import Project from "./Project.model";

export enum ProjectVersionStatus {
  UNKNOWN = 0,
  DRAFT = 1,
  PUBLISHED = 2,
}

export type ProjectVersionSourceData = {
  localSources?: { [name: string]: string };
  remoteSources?: { [name: string]: string };
};

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
   *   local_sources: {name: id, ...}
   *   remote_sources: {name: id, ...}
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

  async updateSources(
    sourceData: ProjectVersionSourceData
  ): Promise<ProjectVersion> {
    this.data = {
      ...this.data,
      local_sources: {
        ...this.data.local_sources,
        ...sourceData.localSources,
      },
      remote_sources: {
        ...this.data.remote_sources,
        ...sourceData.remoteSources,
      },
    };
    return await this.save();
  }

  async createSandboxInstance(): Promise<Instance> {
    const toClone = await this.getHead();
    const instance = await Instance.create({
      project_version_id: this.id,
      project_id: this.project_id,
      data: {},
      status: InstanceStatus.SANDBOX,
    });
    if (true) {
      //this.status === ProjectVersionStatus.PUBLISHED) {
      const contracts = await toClone.$get("contracts");
      const toCreate = await Promise.all(
        contracts.map(async (c) => {
          return {
            params: c.constructor_params,
            source: await c.getContractSource(),
            type: c.contract_source_type,
          };
        })
      );
      await Promise.all(
        toCreate.map(({ params, source, type }) => {
          Contract.importFromSource(source, type, instance.id, params);
        })
      );
    }
    return instance;
  }

  async createBlankHeadInstance() {
    if (this.status === ProjectVersionStatus.DRAFT) {
      const instance = await Instance.create({
        project_version_id: this.id,
        project_id: this.project_id,
        data: {},
        status: InstanceStatus.HEAD,
      });
      await instance.makeHead();
    }
  }

  async getHead() {
    return await Instance.findOne({
      where: {
        project_version_id: this.id,
        status: InstanceStatus.HEAD,
      },
    });
  }
}
