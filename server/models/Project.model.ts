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
import User from "./User.model";
import Node from "./Node.model";
import ProjectVersion, { ProjectVersionStatus } from "./ProjectVersion.model";

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

  // Publishes to blockchain and returns address as well as saves to db
  static async createProjectWithDefaultVersion({
    user_id,
    node_id,
    project_metadata = {},
    version_metadata = {},
  }): Promise<Project> {
    const project = await Project.create({
      user_id: user_id,
      node_id: node_id,
      metadata: project_metadata,
    });
    // create a default version
    const projectVersion = await ProjectVersion.create({
      project_id: project.id,
      data: version_metadata,
      status: ProjectVersionStatus.DRAFT,
    });
    return project;
  }
}
