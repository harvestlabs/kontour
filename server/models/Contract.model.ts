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
import { getContractCode } from "../utils/etherscan";
import SimpleStorage from "../../contour/templates/SimpleStorage";
import {
  deployBinaryAndABI,
  deployFromSource,
  deployfromTemplate,
} from "../../contour/deployer/deploy";
import ERC721Minter from "../../contour/templates/ERC721";
import ContractSource from "./ContractSource.model";
import Project from "./Project.model";
import S3ContractSource, {
  TruffleContractJSON,
} from "./S3ContractSource.model";
import Instance from "./Instance.model";

export enum ContractSourceType {
  TEMPLATE = 1,
  FROM_CHAIN = 2,
  S3_IMPORT = 3,
}

export enum ContractTemplate {
  SIMPLE_STORAGE = "SimpleStorage",
  SIMPLE_ERC721 = "ERC721",
}
export const templateMapping = {
  [ContractTemplate.SIMPLE_STORAGE]: SimpleStorage,
  [ContractTemplate.SIMPLE_ERC721]: ERC721Minter,
};
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

  static async importByAddressAndChain(
    address: string,
    chainId: number,
    instanceId: string
  ): Promise<Contract> {
    const instance = await Instance.findByPk(instanceId, {
      include: Project,
    });

    let source = await ContractSource.findOne({
      where: {
        address: address,
        chain_id: chainId,
      },
    });
    if (!source) {
      const { SourceCode, ABI, ContractName } = await getContractCode(
        address,
        chainId
      );
      source = await ContractSource.create({
        address: address,
        chain_id: chainId,
        abi: ABI,
        source: SourceCode,
        name: ContractName,
        user_id: instance.project.user_id,
      });
    }
    return await Contract.createFromSource(source, instanceId);
  }

  static async createFromTemplate(
    templateName: ContractTemplate,
    templateArgs: any,
    instanceId: string
  ): Promise<Contract> {
    const instance = await Instance.findByPk(instanceId, {
      include: { model: Project, include: [Node] },
    });
    const nodeId = instance.project.node.id;
    const toDeploy = new templateMapping[templateName](templateArgs);
    const results = await deployfromTemplate(toDeploy, nodeId);
    const contract = await Contract.create({
      address: results.address,
      node_id: nodeId,
      name: toDeploy.name,
    });
    await ContractSource.create({
      address: contract.address,
      chain_id: instance.project.node.data.chainId,
      abi: results.abi,
      source: results.source,
      name: toDeploy.name,
      user_id: instance.project.user_id,
    });
    return contract;
  }

  static async createFromSource(
    cs: ContractSource,
    instanceId: string
  ): Promise<Contract> {
    const instance = await Instance.findByPk(instanceId, {
      include: { model: Project, include: [Node] },
    });
    const nodeId = instance.project.node.id;

    const results = await deployFromSource(cs.source, cs.name, nodeId);
    const contract = await Contract.create({
      address: results.address,
      name: cs.name,
      contract_source_type: ContractSourceType.FROM_CHAIN,
      contract_source_id: cs.id,
    });
    return contract;
  }

  static async createFromSourceString(
    source: string,
    name: string,
    instanceId: string
  ): Promise<Contract> {
    const instance = await Instance.findByPk(instanceId, {
      include: { model: Project, include: [Node] },
    });
    const nodeId = instance.project.node.id;
    const results = await deployFromSource(source, name, nodeId);
    const contractSource = await ContractSource.create({
      address: results.address,
      chain_id: instance.project.node.data.chainId,
      abi: results.abi,
      source: results.source,
      name: name,
      user_id: instance.project.user_id,
    });
    const contract = await Contract.create({
      address: results.address,
      node_id: nodeId,
      contract_source_type: ContractSourceType.TEMPLATE,
      contract_source_id: contractSource.id,
    });

    return contract;
  }

  static async importFromS3Source(
    source: S3ContractSource,
    instanceId: string,
    params: any[]
  ): Promise<Contract> {
    const instance = await Instance.findByPk(instanceId, {
      include: { model: Project, include: [Node] },
    });
    const nodeId = instance.project.node.id;
    const data = await source.fromS3();
    const jsonData: TruffleContractJSON = JSON.parse(data.toString());

    const address = await deployBinaryAndABI(
      nodeId,
      jsonData.bytecode,
      jsonData.abi
    );
    return await Contract.create({
      address: address,
      node_id: nodeId,
      contract_source_type: ContractSourceType.S3_IMPORT,
      contract_source_id: source.id,
    });
  }
}
