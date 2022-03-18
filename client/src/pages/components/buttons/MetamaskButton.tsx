import React, { useCallback, useEffect } from "react";
import { Button, ButtonProps } from "@chakra-ui/react";

import logger from "@utils/logger";
import { IS_SERVER } from "@utils/constants";
import { selectAddress, setAddressTo } from "@redux/slices/ethSlice";
import { useAppDispatch, useAppSelector } from "@redux/hooks";

export default function MetaMaskButton({ ...props }: ButtonProps) {
  const dispatch = useAppDispatch();
  // @ts-ignore
  const kontour = IS_SERVER ? null : window.kontour;
  const ethProviderAvailable = kontour?.isMetamaskAvailable();
  const selectedAddress = useAppSelector(selectAddress);

  logger.log("[Metamask] selectedAddress: ", selectedAddress);

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
      {...props}
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
