// @ts-nocheck
import Web3 from "web3";
import config from "../../config";

console.log("polygon", config.polygon.GETH_URL);
console.log("ethereum", config.eth.GETH_URL);
export const polygonWeb3 = new Web3(config.polygon.GETH_URL);
export const account = polygonWeb3.eth.accounts.privateKeyToAccount(
  config.polygon.KEY
);
console.log("account", account.address);
export const ethWeb3 = new Web3(config.eth.GETH_URL);
