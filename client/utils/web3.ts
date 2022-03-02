import detectEthereumProvider from "@metamask/detect-provider";
import { eth } from "./constants";

export async function isMetaMaskInstalled() {
  const provider = await detectEthereumProvider();
  return Boolean(provider && (provider as { isMetaMask: boolean }).isMetaMask);
}

export type NetworkType = "polygon" | "mumbai" | "eth" | "ropsten";

const chainMappings: Record<
  NetworkType,
  {
    id: string;
    name: string;
    symbol: string;
    decimals: number;
    rpcUrls: string[];
    blockExplorerUrls: string[];
  }
> = {
  polygon: {
    id: "0x89",
    name: "Polygon Mainnet",
    symbol: "MATIC",
    decimals: 18,
    rpcUrls: ["https://polygon-rpc.com/"],
    blockExplorerUrls: ["https://polygonscan.com/"],
  },
  mumbai: {
    id: "0x13881",
    name: "Polygon Testnet (Mumbai)",
    symbol: "MATIC",
    decimals: 18,
    rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
    blockExplorerUrls: ["https://polygonscan.com/"],
  },
  eth: {
    id: "0x1",
    name: "Ethereum Mainnet",
    symbol: "ETH",
    decimals: 18,
    rpcUrls: [],
    blockExplorerUrls: [],
  },
  ropsten: {
    id: "0x3",
    name: "Ropsten Testnet",
    symbol: "ETH",
    decimals: 18,
    rpcUrls: [],
    blockExplorerUrls: [],
  },
};

// https://docs.metamask.io/guide/ethereum-provider.html#events
interface ProviderRPCError extends Error {
  code: number;
}

export async function switchOrAddChain(chainName: NetworkType) {
  try {
    await eth.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainMappings[chainName].id }],
    });
  } catch (error) {
    if (!(error instanceof Error)) {
      throw `Something went wrong detecting switch errors: ${error}`;
    }
    // This error code indicates that the chain has not been added to MetaMask.
    if ((error as ProviderRPCError).code === 4902) {
      try {
        await eth.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: chainMappings[chainName].id,
              chainName: chainMappings[chainName].name,
              nativeCurrency: {
                symbol: chainMappings[chainName].id,
                decimals: chainMappings[chainName].name,
              },
              rpcUrls: chainMappings[chainName].rpcUrls,
              blockExplorerUrls: chainMappings[chainName].blockExplorerUrls,
            },
          ],
        });
      } catch (addError) {
        // handle "add" error
        alert(
          `${
            (error as ProviderRPCError).code
          }. Something went wrong while trying to add network: ${
            error?.message
          }`
        );
      }
    } else {
      alert(
        `Error ${
          (error as ProviderRPCError).code
        }. Something went wrong while trying to switch networks: ${
          error?.message
        }`
      );
    }
  }
}
