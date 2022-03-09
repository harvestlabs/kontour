import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@chakra-ui/react";

import logger from "@utils/logger";
import { eth, web3 } from "@utils/constants";
import { selectAddress, setAddressTo } from "@redux/slices/ethSlice";
import { useAppDispatch, useAppSelector } from "@redux/hooks";

export default function MetaMaskButton() {
  const ethProviderAvailable = eth != null;
  const dispatch = useAppDispatch();
  const selectedAddress = useAppSelector(selectAddress);

  logger.log("[Metamask] selectedAddress: ", eth, selectedAddress);

  useEffect(() => {
    async function checkAccounts() {
      try {
        const accounts = await eth.request({ method: "eth_accounts" });
        if (!accounts?.length) {
          logger.log("[Metamask] User is not connected to metamask");
          return;
        }
        logger.log(
          "[MetamaskButton] eth_accounts account found: ",
          accounts[0]
        );
        // otherwise we found the current address, let's store it
        dispatch(setAddressTo(accounts[0]));
      } catch (e) {
        logger.error("[Metamask] eth_accounts Unexpected error: ", e);
      }
    }
    if (ethProviderAvailable) {
      checkAccounts();
    }
  }, [dispatch, ethProviderAvailable]);

  const requestUserAccounts = useCallback(async () => {
    if (ethProviderAvailable) {
      try {
        const accounts = await eth.request({
          method: "eth_requestAccounts",
        });

        logger.log("[MetamaskButton] eth_requestAccounts accounts: ", accounts);

        if (!accounts?.length) {
          logger.log("User is not connected to metmask");
          return;
        }
        logger.log(
          "[MetamaskButton] eth_requestAccounts account found: ",
          accounts[0]
        );
        // otherwise we found the current address, let's store it
        dispatch(setAddressTo(accounts[0]));
      } catch (err: any) {
        if (err?.code === 4001) {
          logger.error("[Metamask] eth_requestAccounts user rejected: ", err);
          // EIP-1193 userRejectedRequest error
          // don't do anything since we didn't successfully connect
          alert(`User rejected request: ${err}`);
        } else {
          logger.error(
            "[Metamask] eth_requestAccounts Unexpected error: ",
            err
          );
          // unknown error
          throw err;
        }
      }
    }
  }, [dispatch, ethProviderAvailable]);

  return (
    <Button size="lg" onClick={requestUserAccounts}>
      {ethProviderAvailable
        ? selectedAddress
          ? "Connected"
          : "Connect"
        : "Install MetaMask"}
    </Button>
  );
}

const styles = {};
