// @ts-nocheck
import Web3 from "web3";
import config from "../../config";
import Node from "../../server/models/Node.model";
import Project from "../../server/models/Project.model";

console.log("polygon", config.polygon.GETH_URL);
console.log("ethereum", config.eth.GETH_URL);
const polygonWeb3 = new Web3(config.polygon.GETH_URL);
const ethWeb3 = new Web3(config.eth.GETH_URL);
export const polygon = {
  web3: polygonWeb3,
  account: polygonWeb3.eth.accounts.privateKeyToAccount(config.polygon.KEY),
};
export const local = async (projectId: string) => {
  const project = await Project.findByPk(projectId, { include: Node });
  console.log("local", project.node.data.hostUrl);
  const localWeb3 = new Web3(project.node.data.hostUrl);
  return {
    web3: localWeb3,
    account: localWeb3.eth.accounts.privateKeyToAccount(config.ganache.PK),
  };
};
export const eth = {
  web3: ethWeb3,
  account: ethWeb3.eth.accounts.privateKeyToAccount(config.eth.KEY),
};
