import React from "react";
import {
  Text,
  FormLabel,
  Button,
  Input,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
} from "@chakra-ui/react";
import { InstanceFragment_contracts } from "@gql/__generated__/InstanceFragment";
import { gql, useQuery } from "@apollo/client";

// const GET_DEPLOY_INFO = gql`
//     query GetDeployInfo($contractIds: JSON!) {
//         getDeployInfo(contractIds: $contractIds) {

//         }
//     }
// `

type Props = {
  contracts: InstanceFragment_contracts[];
};

export default function MainnetDeployButton({ contracts }: Props) {
  // const {data, loading, error} = useQuery(GET_DEPLOY_INFO);
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  return (
    <>
      <Button
        size="lg"
        zIndex="10000"
        position="fixed"
        bottom="24px"
        right="24px"
        onClick={() => setIsOpen(true)}
      >
        Deploy to Mainnet
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogBody>
            About to deploy{" "}
            {contracts.map((c, idx) => {
              return (
                <Box key={idx}>
                  <Text>Contract: {c.contractSource.name}</Text>
                  <Text>
                    Constructor: {JSON.stringify(c.constructor_params)}
                  </Text>
                </Box>
              );
            })}
            to mainnet.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button variant="reject" onClick={onClose} ml={3}>
              Deploy
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
