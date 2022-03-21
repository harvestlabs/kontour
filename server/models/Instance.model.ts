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
  AfterUpdate,
} from "sequelize-typescript";
import Op from "sequelize/lib/operators";
import { v4 } from "uuid";
import { getConstructor, getEvents, getFunctions } from "../utils/etherscan";
import { generateKontour } from "../utils/generator";
import Contract, { ContractSourceType } from "./Contract.model";
import LocalContractSource from "./LocalContractSource.model";
import Node from "./Node.model";
import Project from "./Project.model";
import ProjectVersion from "./ProjectVersion.model";
import RemoteContractSource from "./RemoteContractSource.model";

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

  @Column(DataType.STRING)
  generated_lib: string;

  @BelongsTo(() => Project, "project_id")
  project: Project;

  @BelongsTo(() => ProjectVersion, "project_version_id")
  project_version: ProjectVersion;

  @HasMany(() => Contract, "instance_id")
  contracts: Contract[];

  async generateCode() {
    const contracts = await Contract.findAll({
      where: {
        instance_id: this.id,
      },
    });

    const localContracts = contracts.filter(
      (contract) => contract.contract_source_type === ContractSourceType.LOCAL
    );
    const remoteContracts = contracts.filter(
      (contract) => contract.contract_source_type === ContractSourceType.REMOTE
    );

    const localContractSources = await LocalContractSource.findAll({
      where: {
        id: localContracts.map((local_con) => local_con.contract_source_id),
      },
    });

    const remoteContractSources = await RemoteContractSource.findAll({
      where: {
        id: remoteContracts.map((localCon) => localCon.contract_source_id),
      },
    });

    const contractsObject = contracts.reduce((memo: any, contract) => {
      let contractSource: any;
      if (contract.contract_source_type === ContractSourceType.REMOTE) {
        contractSource = remoteContractSources.find(
          (source) => source.id === contract.contract_source_id
        );
      } else {
        contractSource = localContractSources.find(
          (source) => source.id === contract.contract_source_id
        );
      }

      const name =
        memo[contractSource.name] == null
          ? contractSource.name
          : contractSource.name + "Copy";

      memo[name] = {
        name,
        address: contract.address,
        abi: contractSource.abi,
        functionASTs: getFunctions(contractSource.abi),
        constructorAST: getConstructor(contractSource.abi),
        eventASTs: getEvents(contractSource.abi),
      };
      return memo;
    }, {});

    const kontour = generateKontour(
      this.project.node.data?.chainId,
      this.project.data?.name,
      contractsObject
    );

    this.generated_lib = kontour;

    return await this.save();
  }

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

  async getGlobalContracts(): Promise<Contract[]> {
    const node = await Node.findByPk(await this.getNodeId());
    return await Contract.findAll({
      where: { id: node.data.globalContracts || [] },
    });
  }
}
