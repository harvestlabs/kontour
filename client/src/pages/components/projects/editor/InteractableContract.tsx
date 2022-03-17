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

  useEffect(() => {
    events.map((event) => {
      contract.events[event.name]({}, (err: any, e: any) => {
        console.log(`[event] ${contractSource.name}.${event.name}`, err, e);
      });
    });
  }, [contract, events]);

  return contractSource != null ? (
    <Flex width="100%" flexDirection="column" padding="40px">
      <Heading>{contractSource.name}.sol</Heading>
      <Flex mt="20px" px="16px">
        <Heading fontSize="14px" variant="nocaps">
          Events
        </Heading>
        <Flex></Flex>
      </Flex>
      <Flex width="100%">
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
              Current Contract State
            </TableCaption>
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
                <Th>View</Th>
                <Th>Inputs</Th>
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
        <Box flex="1">
          <Table variant="simple" size="sm">
            <TableCaption textAlign="left" placement="top">
              Executable Functions
            </TableCaption>
            <Thead>
              <Tr>
                <Th>Function</Th>
                <Th>Inputs</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Th>Payable</Th>
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
                <Th>Nonpayable</Th>
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
      }
    }
  `,
};
