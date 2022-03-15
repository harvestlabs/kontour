import React, { useEffect, useMemo, useState } from "react";
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
  HStack,
  Table,
  TableCaption,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
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
import parseEvents from "@utils/event_parser";
import ContractValueTableRowRenderer, {
  ContractFunctionValueType,
} from "./contract/ContractValueTableRowRenderer";

type Props = { contract: InteractableContractFragment };

export default function InteractableContract({
  contract: { id, address, contractSource },
}: Props) {
  const [argsMapping, setArgsMapping] = useState<any>({});
  const [eventData, setEventData] = useState<any>("");
  const [gasUsed, setGasUsed] = useState<number | null>(null);
  const [result, setResult] = useState<any>(null);
  let {
    functions,
    // constructor,
    events,
    abi,
  }: {
    functions: ContractSourceFunction[];
    events: ContractSourceEvent[];
    // contructor: ContractSourceConstructor;
    abi: any;
  } = contractSource || {};
  const abiJson = useMemo(() => {
    return JSON.parse(JSON.stringify(abi));
  }, [abi]);

  // @ts-ignore
  const kontour = window.kontour;

  const contract = useMemo(
    () => new kontour.web3.eth.Contract(abiJson, address),
    [abiJson, address, kontour.web3.eth.Contract]
  );

  const getters = useMemo(
    () => functions.filter((func) => func.stateMutability === "view"),
    [functions]
  );
  const nonpayables = useMemo(
    () => functions.filter((func) => func.stateMutability === "nonpayable"),
    [functions]
  );

  const [getterValuesWithoutParams, setGetterValuesWithoutParams] = useState<
    ContractFunctionValueType[]
  >([]);
  const [getterValuesWithParams, setGetterValuesWithParams] = useState<
    ContractFunctionValueType[]
  >([]);

  useEffect(() => {
    async function fetchGetterValuesAsync(
      innerGetters: ContractSourceFunction[]
    ) {
      // we only want to show the values we can get with no input
      const [getterValuesWithoutParams, getterValuesWithParams] =
        await Promise.all([
          Promise.all(
            innerGetters
              .filter((func) => func.inputs.length === 0)
              .map(async (func) => {
                return {
                  name: func.name,
                };
              })
          ),

          Promise.all(
            innerGetters
              .filter((func) => func.inputs.length > 0)
              .map(async (func) => {
                return {
                  name: func.name,
                  inputs: func.inputs,
                };
              })
          ),
        ]);
      setGetterValuesWithoutParams(getterValuesWithoutParams);
      setGetterValuesWithParams(getterValuesWithParams);
    }

    fetchGetterValuesAsync(getters);
  }, [contract.methods, getters]);

  return contractSource != null ? (
    <Flex width="100%" flexDirection="column" padding="40px">
      <Heading>{contractSource.name}.sol</Heading>

      <Flex direction="column">
        <Table variant="simple">
          <TableCaption placement="top">Current Contract State</TableCaption>
          <Thead>
            <Tr>
              <Th>View</Th>
              <Th>Value</Th>
            </Tr>
          </Thead>
          <Tbody>
            {getterValuesWithoutParams.map((getterValue) => {
              return (
                <ContractValueTableRowRenderer
                  key={getterValue.name}
                  contract={contract}
                  name={getterValue.name}
                />
              );
            })}
            <Tr>
              <Th>Inputs</Th>
              <Th></Th>
            </Tr>
            {getterValuesWithParams.map((getterValue) => {
              return (
                <ContractValueTableRowRenderer
                  key={getterValue.name}
                  name={getterValue.name}
                  contract={contract}
                  inputs={getterValue.inputs}
                />
              );
            })}
          </Tbody>
        </Table>
        {getters.map((func: any) => {
          return func.inputs.length === 0 ? (
            <Box key={func.name}>
              <Text>Function: {func.name}</Text>
              {func.inputs.map((input: any) => (
                <Input key={input.name} />
              ))}
              <Button
                key={func.name}
                onClick={async () => {
                  const a = await contract.methods[func.name]().call();
                  setResult(a);
                }}
              >
                {func.name}(
                {func.inputs.reduce(
                  (memo: string, input: any, idx: number) =>
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
          ) : null;
        })}
      </Flex>

      <VStack>
        <Text>Latest result: {result}</Text>
        <Text>Events: {eventData}</Text>
        <Text>Gas: {gasUsed}</Text>
      </VStack>

      <HStack width="100%">
        <VStack alignItems="flex-start" width="100%">
          <Box width="100%">
            <Text>Getters</Text>
            {getters.map((func: any) => (
              <Box key={func.name}>
                <Text>Function: {func.name}</Text>
                {func.inputs.map((input: any) => (
                  <Input key={input.name} />
                ))}
                <Button
                  key={func.name}
                  onClick={async () => {
                    const a = await contract.methods[func.name]().call();
                    setResult(a);
                  }}
                >
                  {func.name}(
                  {func.inputs.reduce(
                    (memo: string, input: any, idx: number) =>
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
                    const inputValues = (func.inputs || []).map(
                      (input: any) => {
                        return argsMapping[func.name]?.[input.name];
                      }
                    );
                    const transaction = contract.methods[func.name](
                      ...inputValues
                    );
                    const account = kontour.getAccount();
                    const tx = await transaction.send({
                      from: account,
                      gas: await transaction.estimateGas({ from: account }),
                    });
                    setGasUsed(tx.gasUsed);
                    setEventData(
                      JSON.stringify(
                        parseEvents(tx.events, contractSource.events)
                      )
                    );
                  }}
                >
                  {func.name}(
                  {func.inputs.reduce(
                    (memo: string, input: any, idx: number) =>
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
      </HStack>
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
