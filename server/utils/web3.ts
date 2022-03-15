// @ts-nocheck
import Web3 from "web3";
import config from "../../config";
import Node from "../../server/models/Node.model";

console.log("polygon", config.polygon.GETH_URL);
console.log("ethereum", config.eth.GETH_URL);
export const eth = {
  mainnet: new Web3(config.eth.GETH_URL),
  ropsten: new Web3(config.eth.GETH_TEST_URL),
};
export const polygon = {
  mainnet: new Web3(config.polygon.GETH_URL),
  testnet: new Web3(config.polygon.GETH_TEST_URL),
};
export const local = async (nodeId: string) => {
  const node = await Node.findByPk(nodeId);
  console.log("local", node.data.hostUrl);
  const localWeb3 = new Web3(node.data.hostUrl);
  return {
    web3: localWeb3,
    account: localWeb3.eth.accounts.privateKeyToAccount(config.ganache.PK),
  };
};
