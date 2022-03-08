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
  1: { chain: "etherscan", url: "https://api.etherscan.io" },
  2: { chain: "etherscan", url: "https://api-goerli.etherscan.io" },
  3: { chain: "etherscan", url: "https://api-ropsten.etherscan.io" },
  5: { chain: "etherscan", url: "https://api-kovan.etherscan.io" },
  4: { chain: "etherscan", url: "https://api-rinkeby.etherscan.io" },
  80001: { chain: "polygonscan", url: "https://api.polygonscan.com" },
  137: { chain: "polygonscan", url: "https://api-testnet.polygonscan.com" },
};

const contractABIEndpoint = (address: string, chainId: number): string => {
  const { chain, url } = ENDPOINTS[chainId];
  return `${url}/api?module=contract&action=getabi&address=${address}&apikey=${config[chain].KEY}`;
};

const contractSourceEndpoint = (address: string, chainId: number): string => {
  const { chain, url } = ENDPOINTS[chainId];
  return `${url}/api?module=contract&action=getsourcecode&address=${address}&apikey=${config[chain].KEY}`;
};

export async function getContractABI(
  address: string,
  chainId: number
): Promise<any> {
  const ep = contractABIEndpoint(address, chainId);
  const resp = await fetch(ep);
  const data = await resp.json();
  if (data.status === "1") {
    return JSON.parse(data.result);
  }
}

export async function getContractCode(
  address: string,
  chainId: number
): Promise<any> {
  const ep = contractSourceEndpoint(address, chainId);
  const resp = await fetch(ep);
  const data = await resp.json();
  if (data.status === "1") {
    return JSON.parse(data.result[0]);
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
