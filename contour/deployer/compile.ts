import fs from "fs";
import { exec } from "child_process";

const TEMP_FILENAMES = [...Array(280).keys()].map((i) => `trial_solc_{i}`);
let filenameIdx = 0;

export const TEMP_JSON = (filename: string, name: string) => {
  return `build_contour_deployer_temp_sol_${name}.abi`;
};
export const TEMP_BIN = (filename: string, name: string) => {
  return `build_contour_deployer_temp_sol_${name}.bin`;
};

export interface CompileResult {
  success: boolean;
  message: string;
}

export async function tryCompile(source: string): Promise<CompileResult> {
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
          message: TEMP_FILENAMES[filenameIdx],
        });
      }
    );
  });
  return result;
}
