import Web3 from "web3";

import detectEthereumProvider from "@metamask/detect-provider";
import { NetworkType } from "./web3";

export const IS_SERVER = typeof window === "undefined";

export const ETH_CHAIN: NetworkType =
  process.env.NEXT_PUBLIC_ENV === "prod" ? "ropsten" : "ropsten";

export const POLYGON_CHAIN: NetworkType =
  process.env.NEXT_PUBLIC_ENV === "prod" ? "mumbai" : "mumbai";

let eth: any = null;
let web3: Web3 = new Web3(Web3.givenProvider);
if (!IS_SERVER) {
  // this returns the provider, or null if it wasn't detected
  const metamaskEthereumProvider = await detectEthereumProvider();

  if (metamaskEthereumProvider !== window?.ethereum) {
    console.error("Do you have multiple wallets installed?");
  }
  eth = metamaskEthereumProvider;
}
export { eth, web3 };
