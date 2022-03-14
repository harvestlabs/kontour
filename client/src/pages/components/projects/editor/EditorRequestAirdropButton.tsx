import React from "react";
import { Button, useToast } from "@chakra-ui/react";
import { selectAddress } from "@redux/slices/ethSlice";
import { useAppSelector } from "@redux/hooks";
import { airdropToAddress } from "@utils/airdrop";
import { gql, useMutation } from "@apollo/client";

type Props = { node_id: string };

const REQUEST_AIRDROP = gql`
  mutation RequestAirdropMutation($address: String!, $node_id: String!) {
    requestAirdrop(key: $address, nodeId: $node_id)
  }
`;

export default function RequestAirdropButton({
  node_id,
}: React.PropsWithChildren<Props>) {
  const address = useAppSelector(selectAddress);
  const toast = useToast();
  const [requestAirdrop, { loading, error }] = useMutation(REQUEST_AIRDROP, {});

  return (
    <Button
      size="lg"
      colorScheme="green"
      position="absolute"
      top="24px"
      right="24px"
      isLoading={loading}
      isDisabled={loading}
      onClick={async () => {
        const resp = await requestAirdrop({
          variables: {
            address,
            node_id,
          },
        });
        console.log("resp", resp);
        if (resp?.data.requestAirdrop) {
          toast({
            title: "Airdrop successful! You received 1 ETH.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        } else {
          throw new Error("Airdrop failed. Please try again");
        }
      }}
    >
      Get Airdrop
    </Button>
  );
}
