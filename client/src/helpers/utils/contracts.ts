import { web3 } from "./constants";

export function contractFromABI(abi: any, addr: string) {
  // @ts-ignore
  return new web3.eth.Contract(abi, addr);
}

export async function serializeParams(params: any, inputs: any) {
  // params is { name: value }
  // inputs is [{name: string, type: string}, ...]
  // Returns ordered list of param values
  const accounts = await web3.eth.getAccounts();
  return inputs.map((i: any) => {
    if (i.type === "address" && params[i.name] === "me") {
      return accounts[0];
    }
    return params[i.name];
  });
}

export function findABIFunction(abi: any, funcName: string): any {
  const candidates = abi.filter((i: any) => {
    return i.name === funcName;
  });
  if (candidates.length > 0) {
    return candidates[0];
  }
  return null;
}
