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
import User from "./User.model";
import Node from "./Node.model";
import ProjectVersion, { ProjectVersionStatus } from "./ProjectVersion.model";
import Instance from "./Instance.model";

@Table({
  timestamps: true,
  tableName: "projects",
  underscored: true,
})
export default class Project extends Model {
  static User;
  static Versions;

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
  @HasMany(() => ProjectVersion, "project_id")
  versions: ProjectVersion[];
  @HasMany(() => Instance, "project_id")
  instances: Instance[];

  @BeforeCreate
  static async assignToNode(instance: Project) {
    if (!instance.node_id) {
      const node = await Node.getAvailable();
      instance.node_id = node.id;
    }
  }

  // Publishes to blockchain and returns address as well as saves to db
  static async createProjectWithDefaultVersion({
    user_id,
    project_metadata = {},
    version_metadata = {},
  }): Promise<Project> {
    const project = await Project.create({
      user_id: user_id,
      data: project_metadata,
    });
    // create a default version
    await ProjectVersion.create({
      project_id: project.id,
      data: version_metadata,
      status: ProjectVersionStatus.DRAFT,
      name: "V0",
    });
    return project;
  }

  async generateNewDraft(): Promise<ProjectVersion> {
    return await ProjectVersion.create({
      project_id: this.id,
      data: {},
      status: ProjectVersionStatus.DRAFT,
      name: "Untitled",
    });
  }
}
