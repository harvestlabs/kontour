import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@chakra-ui/react";

import logger from "@utils/logger";
import { eth, web3 } from "@utils/constants";
import { selectAddress, setAddressTo } from "@redux/slices/ethSlice";
import { useAppDispatch, useAppSelector } from "@redux/hooks";

export default function MetaMaskButton() {
  // @ts-ignore
  const kontour = window.kontour;
  const ethProviderAvailable = kontour.isMetamaskAvailable();
  const dispatch = useAppDispatch();
  const selectedAddress = useAppSelector(selectAddress);

  logger.log("[Metamask] selectedAddress: ", eth, selectedAddress);

  useEffect(() => {
    async function checkAccounts() {
      const account = await kontour?.fetchMetamaskAccount();
      if (account) {
        dispatch(setAddressTo(account));
      }
    }
    checkAccounts();
  }, [dispatch, kontour]);

  const requestUserAccounts = useCallback(async () => {
    const account = await kontour?.requestMetamaskAccounts();
    if (account) {
      dispatch(setAddressTo(account));
    }
  }, [dispatch, kontour]);

  return (
    <Button
      size="lg"
      onClick={requestUserAccounts}
      // ethProvider hydrates differently on server since it doesn't exist
      suppressHydrationWarning={true}
    >
      {ethProviderAvailable
        ? selectedAddress
          ? "Connected"
          : "Connect"
        : "Install MetaMask"}
    </Button>
  );
}

const styles = {};
