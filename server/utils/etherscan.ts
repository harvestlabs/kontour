import fetch from "node-fetch";
import config from "../../config";
import { eth, polygon } from "./web3";

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
  1: {
    chain: "etherscan",
    url: "https://api.etherscan.io",
    provider: eth.mainnet,
  },
  2: {
    chain: "etherscan",
    url: "https://api-goerli.etherscan.io",
    provider: eth.mainnet,
  },
  3: {
    chain: "etherscan",
    url: "https://api-ropsten.etherscan.io",
    provider: eth.ropsten,
  },
  5: {
    chain: "etherscan",
    url: "https://api-kovan.etherscan.io",
    provider: eth.ropsten,
  },
  4: {
    chain: "etherscan",
    url: "https://api-rinkeby.etherscan.io",
    provider: eth.ropsten,
  },
  137: {
    chain: "polygonscan",
    url: "https://api.polygonscan.com",
    provider: polygon.mainnet,
  },
  80001: {
    chain: "polygonscan",
    url: "https://api-testnet.polygonscan.com",
    provider: polygon.testnet,
  },
};

const contractABIEndpoint = (address: string, chainId: number): string => {
  const { chain, url } = ENDPOINTS[chainId];
  return `${url}/api?module=contract&action=getabi&address=${address}&apikey=${config[chain].KEY}`;
};

const contractSourceEndpoint = (address: string, chainId: number): string => {
  const { chain, url } = ENDPOINTS[chainId];
  return `${url}/api?module=contract&action=getsourcecode&address=${address}&apikey=${config[chain].KEY}`;
};

const contractTxEndpoint = (address: string, chainId: number): string => {
  const { chain, url } = ENDPOINTS[chainId];
  return `${url}/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=0&sort=asc$apikey=${config[chain].KEY}`;
};

const contractInternalTxEndpoint = (
  address: string,
  chainId: number
): string => {
  const { chain, url } = ENDPOINTS[chainId];
  return `${url}/api?module=account&action=txlistinternal&address=${address}&startblock=0&endblock=99999999&page=1&offset=0&sort=asc$apikey=${config[chain].KEY}`;
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
    return data.result[0];
  }
}

export async function getBytecode(
  address: string,
  chainId: number
): Promise<string> {
  let ep = contractTxEndpoint(address, chainId);
  let resp = await fetch(ep);
  let data = await resp.json();
  if (data.status === "1") {
    const result = data.result[0];
    if (result.to === "" && result.contractAddress !== "") {
      return result.input;
    }
  }
  // was this created by another contract? check internal
  ep = contractInternalTxEndpoint(address, chainId);
  resp = await fetch(ep);
  data = await resp.json();
  if (data.status === "1") {
    const result = data.result[0];
    if (result.to === "" && result.contractAddress !== "") {
      return result.input;
    }
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
