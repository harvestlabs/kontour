import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  Default,
  DataType,
  PrimaryKey,
  BelongsTo,
} from "sequelize-typescript";
import { v4 } from "uuid";
import Node from "./Node.model";
import { deployBinaryAndABI } from "../../contour/deployer/deploy";
import RemoteContractSource from "./RemoteContractSource.model";
import Project from "./Project.model";
import LocalContractSource from "./LocalContractSource.model";
import Instance from "./Instance.model";

export enum ContractSourceType {
  REMOTE = 1,
  LOCAL = 2,
}

@Table({
  timestamps: true,
  tableName: "contracts",
  underscored: true,
})
export default class Contract extends Model {
  @Default(v4)
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;
  @CreatedAt
  created_at!: Date;
  @UpdatedAt
  updated_at!: Date;

  @Column(DataType.STRING)
  address: string;

  @Column(DataType.STRING)
  node_id: string;

  @Column(DataType.INTEGER)
  contract_source_type: ContractSourceType;

  @Column(DataType.STRING)
  contract_source_id: string;

  @BelongsTo(() => Node, "node_id")
  node: Node;

  static async importFromSource(
    source: LocalContractSource | RemoteContractSource,
    type: ContractSourceType,
    instanceId: string,
    params: any[]
  ): Promise<Contract> {
    const instance = await Instance.findByPk(instanceId, {
      include: { model: Project, include: [Node] },
    });
    const nodeId = instance.project.node.id;

    const address = await deployBinaryAndABI(
      nodeId,
      source.bytecode,
      source.abi,
      params
    );
    return await Contract.create({
      address: address,
      node_id: nodeId,
      contract_source_type: type,
      contract_source_id: source.id,
    });
  }
}
