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
  ForeignKey,
  AfterCreate,
} from "sequelize-typescript";
import { v4 } from "uuid";
import keccak256 from "keccak256";
import User from "./User.model";
import { getFile, uploadFile } from "../utils/s3";
import Contract from "./Contract.model";
import Instance from "./Instance.model";

export interface TruffleContractJSON {
  contractName: string;
  sourceName?: string;
  abi: any;
  metadata: any;
  bytecode: string;
  deployedBytecode: string;
  immutableReferences: any;
  generatedSources: any[];
  deployedGeneratedSources: any[];
  sourceMap: string;
  deployedSourceMap: string;
  source: string;
  sourcePath: string;
  ast: any;
  legacyAST: any;
  compiler: any;
  networks: any;
  schemaVersion: string;
  updatedAt: string;
  devdoc: any;
  userdoc: any;
  db: any;
}

export enum SourceType {
  UNKNOWN = 0,
  LIB = 1,
  CONTRACT = 2,
}

@Table({
  timestamps: true,
  tableName: "local_contract_sources",
  underscored: true,
})
export default class LocalContractSource extends Model {
  @Default(v4)
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;
  @CreatedAt
  created_at!: Date;
  @UpdatedAt
  updated_at!: Date;

  @Column(DataType.STRING)
  name: string;
  @Column(DataType.STRING)
  source_name: string;
  @Column(DataType.STRING)
  source: string;
  @Column(DataType.JSON)
  compiler: any;
  @Column(DataType.JSON)
  abi: any;
  @Column(DataType.STRING)
  bytecode: string;
  @Column(DataType.JSON)
  db: any;

  @Column(DataType.INTEGER)
  type: SourceType;

  @Column(DataType.STRING)
  version: string;

  @ForeignKey(() => User)
  @Column(DataType.STRING)
  user_id: string;

  @BelongsTo(() => User, "user_id")
  user: User;

  static async uploadToS3(
    userId: string,
    data: TruffleContractJSON
  ): Promise<LocalContractSource> {
    if (!data.bytecode || !data.abi) {
      return null;
    }
    const existing = await LocalContractSource.findOne({
      where: {
        name: data.contractName,
        bytecode: data.bytecode,
        user_id: userId,
      },
    });
    if (existing) {
      return existing;
    }
    const newContractSource = await LocalContractSource.create({
      name: data.contractName,
      source_name: data.sourceName,
      abi: data.abi,
      type: data.abi.length ? SourceType.CONTRACT : SourceType.LIB,
      source: data.source,
      bytecode: data.bytecode,
      compiler: data.compiler,
      db: data.db,
      user_id: userId,
    });
    await uploadFile(
      newContractSource.user_id,
      newContractSource.id,
      "application/json",
      JSON.stringify(data)
    );
    return newContractSource;
  }

  static async importFromS3(
    key: string,
    userId: string
  ): Promise<LocalContractSource> {
    const data: TruffleContractJSON = JSON.parse(
      (await getFile(key)).toString()
    );
    return await LocalContractSource.uploadToS3(userId, data);
  }

  async fromS3(): Promise<Buffer> {
    return await getFile(`${this.user_id || "undefined"}/${this.id}`);
  }

  static async replaceLibraries(
    instanceId: string,
    allSources: LocalContractSource[]
  ): Promise<LocalContractSource[]> {
    // Step 1: get hash => id and name => id
    const hashesToAddrs = {};
    const namesToAddrs = {};
    const libs = allSources.filter((s) => s.type === SourceType.LIB);
    const contracts = await Contract.findAll({
      where: {
        instance_id: instanceId,
      },
    });
    const libContracts = {};
    contracts.forEach((contract) => {
      libContracts[contract.contract_source_id] = contract.address;
    });
    libs.forEach((s) => {
      const hash = keccak256(`${s.source_name}:${s.name}`)
        .toString("hex")
        .substring(0, 34);
      const name = s.name;
      hashesToAddrs[hash] = libContracts[s.id];
      namesToAddrs[name] = libContracts[s.id];
    });
    // Step 2: look for /__$(hash)$__/ OR /__(Name)_____..../ in bytecode
    const hashReg = /__\$([A-Z0-9a-z]+)\$__/g;
    const nameReg = /__([A-Z0-9a-z]+)__+/g;
    return allSources.map((s) => {
      [...s.bytecode.matchAll(hashReg)].forEach((m) => {
        if (m || m[1]) {
          console.log("match", m[1]);
          // Hash matched, look for it
          s.bytecode = s.bytecode.replace(
            m[0],
            hashesToAddrs[m[1]].replace("0x", "")
          );
        }
      });
      [...s.bytecode.matchAll(nameReg)].forEach((m) => {
        if (m || m[1]) {
          console.log("match", m[1]);
          // Hash matched, look for it
          s.bytecode = s.bytecode.replace(
            m[0],
            hashesToAddrs[m[1]].replace("0x", "")
          );
        }
      });
      return s;
    });
  }
}
