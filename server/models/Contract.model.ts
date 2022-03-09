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

  @Column(DataType.INTEGER)
  chain_id: number;

  @Column(DataType.STRING)
  node_id: string;

  @Column(DataType.STRING)
  source: string;

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.JSON)
  abi: any;

  @Column(DataType.INTEGER)
  contract_source_type: ContractSourceType;

  @Column(DataType.STRING)
  contract_source_id: string;

  @BelongsTo(() => Node, "node_id")
  node: Node;

  static async importByAddressAndChain(
    address: string,
    chainId: number,
    projectId: string // The project that we are importing into
  ): Promise<Contract> {
    const project = await Project.findByPk(projectId, { include: Node });
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
        user_id: project.user_id,
      });
    }
    return await Contract.createFromSource(source, projectId);
  }

  static async createFromTemplate(
    templateName: ContractTemplate,
    templateArgs: any,
    projectId: string
  ): Promise<Contract> {
    const project = await Project.findByPk(projectId, { include: Node });
    const toDeploy = new templateMapping[templateName](templateArgs);
    const results = await deployfromTemplate(toDeploy, projectId);
    const contract = await Contract.create({
      address: results.address,
      chain_id: project.node.data.chainId,
      abi: results.abi,
      source: results.source,
      node_id: project.node.id,
      name: toDeploy.name,
    });
    await ContractSource.create({
      address: contract.address,
      chain_id: contract.chain_id,
      abi: contract.abi,
      source: contract.source,
      name: toDeploy.name,
      user_id: project.user_id,
    });
    return contract;
  }

  static async createFromSource(
    cs: ContractSource,
    projectId: string
  ): Promise<Contract> {
    const project = await Project.findByPk(projectId, { include: Node });
    const results = await deployFromSource(cs.source, cs.name, projectId);
    const contract = await Contract.create({
      address: results.address,
      chain_id: project.node.data.chainId,
      abi: results.abi,
      source: results.source,
      node_id: project.node.id,
      name: cs.name,
      contract_source_type: ContractSourceType.FROM_CHAIN,
      contract_source_id: cs.id,
    });
    return contract;
  }

  static async createFromSourceString(
    source: string,
    name: string,
    projectId: string
  ): Promise<Contract> {
    const project = await Project.findByPk(projectId, { include: Node });
    const results = await deployFromSource(source, name, projectId);
    const contractSource = await ContractSource.create({
      address: results.address,
      chain_id: project.node.data.chainId,
      abi: results.abi,
      source: results.source,
      name: name,
      user_id: project.user_id,
    });
    const contract = await Contract.create({
      address: results.address,
      chain_id: project.node.data.chainId,
      abi: results.abi,
      source: results.source,
      node_id: project.node.id,
      name: name,
      contract_source_type: ContractSourceType.TEMPLATE,
      contract_source_id: contractSource.id,
    });

    return contract;
  }

  static async importFromS3Source(
    source: S3ContractSource,
    projectId: string
  ): Promise<Contract> {
    const project = await Project.findByPk(projectId, { include: Node });
    const data = await source.fromS3();
    const jsonData: TruffleContractJSON = JSON.parse(data.toString());

    const address = await deployBinaryAndABI(
      projectId,
      jsonData.bytecode,
      jsonData.abi
    );
    return await Contract.create({
      address: address,
      chain_id: project.node.data.chainId,
      abi: jsonData.abi,
      source: jsonData.source,
      node_id: project.node.id,
      name: jsonData.contractName,
      contract_source_type: ContractSourceType.S3_IMPORT,
      contract_source_id: source.id,
    });
  }
}
