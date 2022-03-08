import { local, polygon, eth } from "./web3";
import { compileSol, compileSourceString } from "solc-typed-ast";
import SimpleStorage from "../templates/SimpleStorage";
import { exec } from "child_process";
import fs from "fs";
import { Account } from "web3-core";
import { ContractType } from "../templates/types";

const TEMP_FILE = "temp.sol";
const TEMP_JSON = (name: string) => {
  return `build_contour_deployer_temp_sol_${name}.abi`;
};
const TEMP_BIN = (name: string) => {
  return `build_contour_deployer_temp_sol_${name}.bin`;
};

export interface DeployResult {
  address: string;
  abi: any;
  source: string;
}

export async function deployfromTemplate(
  contract: ContractType
): Promise<DeployResult> {
  try {
    fs.rmSync(`${__dirname}/${TEMP_FILE}`);
    return await deployFromSource(contract.write(), contract.name);
  } catch (e) {
    console.log("err", e);
  }
}

export async function deployFromSource(
  source: string,
  contractName: string
): Promise<DeployResult> {
  fs.writeFileSync(`${__dirname}/${TEMP_FILE}`, source);
  await new Promise((resolve, reject) => {
    exec(
      `solcjs -o ${__dirname}/../abis ${__dirname}/${TEMP_FILE} --bin --abi`,
      async (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          reject(false);
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          reject(false);
        }
        console.log(`stdout: ${stdout}`);
        resolve(true);
      }
    );
  });
  let abi = JSON.parse(
    fs
      .readFileSync(`${__dirname}/../abis/${TEMP_JSON(contractName)}`)
      .toString()
  );
  let code = fs
    .readFileSync(`${__dirname}/../abis/${TEMP_BIN(contractName)}`)
    .toString();
  let Contract = new local.web3.eth.Contract(abi);
  const transaction = Contract.deploy({ data: code });

  const result = await sendTxAndLog(transaction, local.account);
  console.log("result", result);

  return {
    address: result.contractAddress,
    abi: abi,
    source: source,
  };
}

export async function sendTxAndLog(transaction: any, account: Account) {
  console.log("sending from", account.address);
  const gasPrice = await local.web3.eth.getGasPrice();
  console.log("gas", gasPrice);
  const g = await transaction.estimateGas({ from: account.address });
  console.log("gas2", g);
  const tx = {
    from: account.address,
    to: transaction._parent._address,
    gas: Math.round(g * 1.25),
    gasPrice: gasPrice,
    data: transaction.encodeABI(),
  };

  const signed = await local.web3.eth.accounts.signTransaction(
    tx,
    account.privateKey
  );
  const result = await local.web3.eth.sendSignedTransaction(
    signed.rawTransaction
  );
  return result;
}
