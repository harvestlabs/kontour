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
  HasMany,
} from "sequelize-typescript";
import { v4 } from "uuid";
import Project from "./Project.model";

export interface NodeData {
  hostUrl: string;
  chainId: number;
}

@Table({
  timestamps: true,
  tableName: "nodes",
  underscored: true,
})
export default class Node extends Model {
  static Projects;

  @Default(v4)
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;
  @CreatedAt
  created_at!: Date;
  @UpdatedAt
  updated_at!: Date;

  @Column(DataType.JSON)
  data: NodeData;

  @HasMany(() => Project, "node_id")
  projects: Project[];
}
