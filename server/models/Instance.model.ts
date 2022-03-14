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
import Op from "sequelize/lib/operators";
import { v4 } from "uuid";
import Contract from "./Contract.model";
import Node from "./Node.model";
import Project from "./Project.model";
import ProjectVersion from "./ProjectVersion.model";

export enum InstanceStatus {
  HEAD = 1,
  OLD = 2,
  SANDBOX = 3, // only for published instances
}

@Table({
  timestamps: true,
  tableName: "instances",
  underscored: true,
})
export default class Instance extends Model {
  static Project;

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

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.INTEGER)
  status: InstanceStatus;

  @Column(DataType.STRING)
  project_id: string;

  @Column(DataType.STRING)
  project_version_id: string;

  @BelongsTo(() => Project, "project_id")
  project: Project;

  @BelongsTo(() => ProjectVersion, "project_version_id")
  project_version: ProjectVersion;

  @HasMany(() => Contract, "instance_id")
  contracts: Contract[];

  async makeHead(): Promise<Instance> {
    // Makes this instance the ONLY head of all instances of this version, marks everything else old
    await Instance.update(
      {
        status: InstanceStatus.OLD,
      },
      {
        where: {
          project_version_id: this.project_version_id,
          status: InstanceStatus.HEAD,
          id: {
            [Op.ne]: this.id,
          },
        },
      }
    );
    this.status = InstanceStatus.HEAD;
    return await this.save();
  }

  async getNodeId(): Promise<string> {
    const project = await this.$get("project");
    return project.node_id;
  }
}
