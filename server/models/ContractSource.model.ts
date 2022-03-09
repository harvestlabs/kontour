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
import fs from "fs";
import { exec } from "child_process";

const TEMP_FILENAMES = [...Array(280).keys()].map((i) => `trial_solc_{i}`);
let filenameIdx = 0;

export interface CompileResult {
  success: boolean;
  message: string;
}

@Table({
  timestamps: true,
  tableName: "contract_sources",
  underscored: true,
})
export default class ContractSource extends Model {
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
  source: string;

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.STRING)
  user_id: string;

  @Column(DataType.JSON)
  abi: any;

  static async tryCompile(source: string): Promise<CompileResult> {
    filenameIdx = (filenameIdx + 1) % TEMP_FILENAMES.length;
    fs.writeFileSync(`${__dirname}/${TEMP_FILENAMES[filenameIdx]}`, source);
    const result: CompileResult = await new Promise((resolve, reject) => {
      exec(
        `solcjs -o ${__dirname}/../abis ${__dirname}/${TEMP_FILENAMES[filenameIdx]} --bin --abi`,
        async (error, stdout, stderr) => {
          if (error) {
            console.log(`error: ${error.message}`);
            resolve({
              success: false,
              message: error.message,
            });
          }
          if (stderr) {
            console.log(`stderr: ${stderr}`);
            resolve({
              success: false,
              message: error.message,
            });
          }
          console.log(`stdout: ${stdout}`);
          resolve({
            success: true,
            message: stdout,
          });
        }
      );
    });

    // const files = fs.readdirSync(`${__dirname}/../abis`);
    return result;
  }
}
