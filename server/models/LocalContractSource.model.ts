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
import User from "./User.model";
import { getFile, uploadFile } from "../utils/s3";

export interface TruffleContractJSON {
  contractName: string;
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
  source: string;
  @Column(DataType.JSON)
  compiler: any;
  @Column(DataType.JSON)
  abi: any;
  @Column(DataType.STRING)
  bytecode: string;
  @Column(DataType.JSON)
  db: any;

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
    const newContractSource = await LocalContractSource.create({
      name: data.contractName,
      abi: data.abi,
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
}
