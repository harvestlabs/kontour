import React, { constructor, useEffect, useState } from "react";
import {
  Text,
  Accordion,
  Box,
  Flex,
  Heading,
  Button,
  List,
  ListIcon,
  ListItem,
  Input,
  VStack,
} from "@chakra-ui/react";
import { selectSelectedContractData } from "@redux/slices/projectSlice";
import { useAppSelector } from "@redux/hooks";
import EditorPublishButton from "./EditorPublishButton";
import { gql } from "@apollo/client";
import { functions } from "lodash";
import * as Icons from "react-feather";
import { EditorInteractionViewFragment } from "@gql/__generated__/EditorInteractionViewFragment";
import Web3 from "web3";
import { InteractableContractFragment } from "@gql/__generated__/InteractableContractFragment";

type Props = { contract: InteractableContractFragment };

export default function InteractableContract({
  contract: { id, address, contractSource },
}: Props) {
  const [argsMapping, setArgsMapping] = useState<any>({});
  let { functions, constructor, events, abi } = contractSource || {};
  const abiJson = JSON.parse(JSON.stringify(abi));

  //@ts-ignore
  const kontour = window.kontour;

  const contract = new kontour.web3.eth.Contract(abiJson, address);

  const getters = functions.filter(
    (func: any) => func.stateMutability === "view"
  );
  const nonpayables = functions.filter(
    (func: any) => func.stateMutability === "nonpayable"
  );

  return contractSource != null ? (
    <Flex width="100%" flexDirection="column">
      <Heading>{contractSource.name}</Heading>
      <VStack alignItems="flex-start">
        <Box>
          <Text>Getters</Text>
          {getters.map((func: any) => (
            <Box key={func.name}>
              <Text>Function: {func.name}</Text>
              {func.inputs.map((input) => (
                <Input key={input.name} />
              ))}
              <Button
                key={func.name}
                onClick={async () => {
                  const json = JSON.parse(JSON.stringify(abi));

                  const a = await contract.methods[func.name]().call();

                  alert(a);
                }}
              >
                {func.name}(
                {func.inputs.reduce(
                  (memo: string, input: any, idx) =>
                    memo +
                    (idx === func.inputs.length - 1
                      ? idx === 0
                        ? `${input.name}`
                        : `${memo} ${input.name}`
                      : `${memo} ${input.name},`),
                  ""
                )}
                )
              </Button>
            </Box>
          ))}
        </Box>
        <Box>
          <Text>Non-payable Transactions</Text>

          {nonpayables.map((func: any) => (
            <Box key={func.name}>
              <Text>Function: {func.name}</Text>
              {func.inputs.map((input: any) => (
                <Input
                  key={input.name}
                  placeholder={input.name}
                  onChange={(e) =>
                    setArgsMapping({
                      ...argsMapping,
                      [func.name]: { [input.name]: e.target.value },
                    })
                  }
                />
              ))}
              <Button
                key={func.name}
                onClick={async () => {
                  const inputValues = (func.inputs || []).map((input: any) => {
                    return argsMapping[func.name]?.[input.name];
                  });

                  const a = await contract.methods[func.name](
                    ...inputValues
                  ).send({
                    from: kontour.getAccount(),
                  });
                }}
              >
                {func.name}(
                {func.inputs.reduce(
                  (memo: string, input: any, idx) =>
                    memo +
                    (idx === func.inputs.length - 1
                      ? idx === 0
                        ? `${input.name}`
                        : `${memo} ${input.name}`
                      : `${memo} ${input.name},`),
                  ""
                )}
                )
              </Button>
            </Box>
          ))}
        </Box>
        <Text>Payable Transactions</Text>
      </VStack>
    </Flex>
  ) : null;
}

InteractableContract.fragments = {
  contract: gql`
    fragment InteractableContractFragment on Contract {
      id
      address
      contractSource {
        id
        name
        functions
        constructor
        abi
        events
      }
    }
  `,
};
