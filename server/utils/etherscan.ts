import fetch from "node-fetch";
import config from "../../config";

export interface ContractParam {
  name: string;
  type: string;
}
export interface ContractFunction {
  constant: boolean;
  inputs: ContractParam[];
  outputs: ContractParam[];
  stateMutability: string;
  name: string;
}
export interface ContractEvent {
  anonymous: boolean;
  inputs: ContractParam[];
  name: string;
}
export interface ContractConstructor {
  inputs: ContractParam[];
}

export const ENDPOINTS = {
  mainnet: "https://api.etherscan.io",
  goerli: "https://api-goerli.etherscan.io",
  ropsten: "https://api-ropsten.etherscan.io",
  kovan: "https://api-kovan.etherscan.io",
  rinkeby: "https://api-rinkeby.etherscan.io",
};

const contractABIEndpoint = (address: string): string => {
  const ep = ENDPOINTS[config.eth.ENV];
  return `${ep}/api?module=contract&action=getabi&address=${address}&apikey=${config.etherscan.KEY}`;
};

export async function getContractABI(address: string): Promise<any> {
  const ep = contractABIEndpoint(address);
  const resp = await fetch(ep);
  const data = await resp.json();
  if (data.status === "1") {
    return JSON.parse(data.result);
  }
}

export function getFunctions(abi: any): ContractFunction[] {
  return abi.filter((item) => item.type === "function");
}

export function getEvents(abi: any): ContractEvent[] {
  return abi.filter((item) => item.type === "event");
}

export function getConstructor(abi: any): ContractConstructor | null {
  const maybe = abi.filter((item) => item.type === "constructor");
  return maybe.length > 0 ? maybe[0] : null;
}
