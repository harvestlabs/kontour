import { local, polygon, eth } from "../../server/utils/web3";
import { Account } from "web3-core";

const TEMP_FILE = "temp.sol";

export interface DeployResult {
  address: string;
  abi: any;
  source: string;
}

export async function deployBinaryAndABI(
  nodeId: string,
  binary: string,
  abi: any,
  params: any[]
): Promise<string> {
  const { web3, account } = await local(nodeId);

  let Contract = new web3.eth.Contract(abi);
  const transaction = Contract.deploy({ data: binary, arguments: [...params] });

  const result = await sendTxAndLog(web3, transaction, account);
  console.log("result", result);

  return result.contractAddress;
}

export async function sendTxAndLog(
  web3: any,
  transaction: any,
  account: Account
) {
  console.log("sending from", account.address);
  const gasPrice = await web3.eth.getGasPrice();
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

  const signed = await web3.eth.accounts.signTransaction(
    tx,
    account.privateKey
  );
  const result = await web3.eth.sendSignedTransaction(signed.rawTransaction);
  return result;
}
