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
import {
  appendLog,
  selectLogs,
  selectSelectedContractData,
} from "@redux/slices/projectSlice";
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
import { useDispatch } from "react-redux";

type Props = { contract: InteractableContractFragment };

export default function GlobalContractView({
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

  const dispatch = useDispatch();
  const logs = useAppSelector(selectLogs);

  // @ts-ignore
  const kontour = window.kontour;

  const contract = useMemo(
    () => new kontour.web3.eth.Contract(abiJson, address),
    [abiJson, address, kontour.web3.eth.Contract]
  );
  const eventList: any[] = [];

  useMemo(() => {
    events.map((event) => {
      contract.events[event.name](
        {
          fromBlock: "latest",
        },
        (err: any, e: any) => {
          console.log(`[event] ${contractSource.name}.${event.name}`, err, e);
          dispatch(appendLog(parseEvents(e, events)));
        }
      );
    });
  }, [contract.events, contractSource.name, dispatch, events]);

  return (
    <>
      <Text>Logs</Text>
      {logs.map((e, idx) => {
        return <Text key={idx}>{JSON.stringify(e)}</Text>;
      })}
    </>
  );
}
