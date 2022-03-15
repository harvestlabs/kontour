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
  AfterCreate,
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

  @Column(DataType.STRING)
  instance_id: string;

  @Column(DataType.JSON)
  constructor_params: any[];

  @Column(DataType.INTEGER)
  contract_source_type: ContractSourceType;

  @Column(DataType.STRING)
  contract_source_id: string;

  @BelongsTo(() => Node, "node_id")
  node: Node;
  @BelongsTo(() => Instance, "instance_id")
  instance: Instance;

  @AfterCreate
  static async generateCode(contract: Contract) {
    const instance = await Instance.findByPk(contract.instance_id);
    await instance.generateCode();
  }

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
    const contract = await Contract.create({
      address: address,
      node_id: nodeId,
      instance_id: instanceId,
      constructor_params: params,
      contract_source_type: type,
      contract_source_id: source.id,
    });

    return contract;
  }

  async getContractSource(): Promise<
    LocalContractSource | RemoteContractSource
  > {
    if (this.contract_source_type === ContractSourceType.LOCAL) {
      return await LocalContractSource.findByPk(this.contract_source_id);
    }
    return await RemoteContractSource.findByPk(this.contract_source_id);
  }
}
