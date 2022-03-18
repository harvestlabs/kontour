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
  Divider,
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
import ContractExecuteTableRowRenderer from "./contract/ContractExecuteTableRowRenderer";

type Props = { contract: InteractableContractFragment };

export default function InteractableContract({
  contract: { id, address, contractSource },
}: Props) {
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
  const payables = useMemo(
    () => functions.filter((func) => func.stateMutability === "payable"),
    [functions]
  );
  const pures = useMemo(
    () => functions.filter((func) => func.stateMutability === "pure"),
    [functions]
  );

  const [getterValuesWithoutParams, setGetterValuesWithoutParams] = useState<
    ContractFunctionValueType[]
  >([]);
  const [getterValuesWithParams, setGetterValuesWithParams] = useState<
    ContractFunctionValueType[]
  >([]);

  useEffect(() => {
    // we only want to show the values we can get with no input
    const [getterValuesWithoutParams, getterValuesWithParams] = [
      getters
        .filter((func) => func.inputs.length === 0)
        .map((func) => {
          return {
            name: func.name,
          };
        }),
      getters
        .filter((func) => func.inputs.length > 0)
        .map((func) => {
          return {
            name: func.name,
            inputs: func.inputs,
          };
        }),
    ];
    setGetterValuesWithoutParams(getterValuesWithoutParams);
    setGetterValuesWithParams(getterValuesWithParams);
  }, [contract.methods, getters]);

  return contractSource != null ? (
    <Flex width="100%" flexDirection="column" pr="80px">
      <Heading layerStyle="title">{contractSource.name}.sol</Heading>
      <Flex mt="20px" flexDirection="column">
        <Heading layerStyle="info" fontSize="24px" variant="nocaps">
          Events
        </Heading>
        {events.map((event) => {
          return (
            <Box key={event.name}>
              <Text
                variant="code"
                layerStyle="event"
                as="span"
                fontWeight="500"
              >
                {event.name}
              </Text>{" "}
              ({" "}
              {event.inputs.map((input, idx) => {
                return (
                  <Text as="span" key={input.name} variant="code">
                    {input.name}:{" "}
                    <Text layerStyle="type" as="span">
                      {input.type.toString()}
                    </Text>
                    {idx !== event.inputs.length - 1 && ","}
                  </Text>
                );
              })}{" "}
              )
            </Box>
          );
        })}
      </Flex>
      <Flex width="100%">
        <Box flex="1">
          <Table variant="simple" size="sm">
            <TableCaption textAlign="left" placement="top">
              <Text fontWeight="bold" fontSize="24px" layerStyle="title">
                Executable Functions
              </Text>
            </TableCaption>
            <Thead></Thead>

            <Tbody>
              <Tr>
                <Th width="250px">
                  <Text fontSize="14px" layerStyle="subtitle">
                    Payable
                  </Text>
                </Th>
                <Th></Th>
              </Tr>
              {payables.map((func) => {
                return (
                  <ContractExecuteTableRowRenderer
                    payable={true}
                    key={func.name}
                    name={func.name}
                    contract={contract}
                    inputs={func.inputs}
                  />
                );
              })}
              <Tr>
                <Th>
                  <Text fontSize="14px" layerStyle="subtitle">
                    Nonpayable
                  </Text>
                </Th>
                <Th></Th>
              </Tr>
              {nonpayables.map((func) => {
                return (
                  <ContractExecuteTableRowRenderer
                    key={func.name}
                    name={func.name}
                    contract={contract}
                    inputs={func.inputs}
                  />
                );
              })}
            </Tbody>
          </Table>
        </Box>

        <Box width="20px"></Box>
        <Divider orientation="vertical" opacity="0.1" />
        <Box width="20px"></Box>

        <Box flex="1">
          <Table
            variant="simple"
            size="sm"
            sx={{
              "&": {
                tableLayout: "fixed",
              },
            }}
          >
            <TableCaption textAlign="left" placement="top">
              <Text fontWeight="bold" fontSize="24px" layerStyle="title2">
                Current Contract State
              </Text>
            </TableCaption>
            <Thead>
              <Tr>
                <Th>
                  <Text fontSize="14px" layerStyle="subtitle2">
                    Function
                  </Text>
                </Th>
                <Th>
                  <Text fontSize="14px" layerStyle="subtitle2">
                    Value
                  </Text>
                </Th>
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
                <Th>
                  <Text fontSize="14px" layerStyle="subtitle2">
                    Function
                  </Text>
                </Th>
                <Th>
                  <Text fontSize="14px" layerStyle="subtitle2">
                    Inputs
                  </Text>
                </Th>
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
        </Box>
      </Flex>
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
        source_type
      }
    }
  `,
};
