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
import InteractableContract from "./InteractableContract";

type Props = {};

export default function EditorInteractionView({}: Props) {
  const contract_source = useAppSelector(selectSelectedContractData);

  const [contract, setContract] = useState<any>(null);

  // REPLACE THIS WITH AN ARRAY OF CONTRACTS FOR INSTANCe FROM GRAPHQL
  const contracts: InteractableContractFragment[] = [
    {
      __typename: "Contract",
      id: "2e232973-934d-4955-9438-97019ebd4b60",
      address: "0xbB3E54f2456885EB1af717db2a4ED0D3A4d7942E",
      contractSource: {
        __typename: "ContractSource",
        id: "3ba55c39-3fe9-46c7-8653-b3aff931cd26",
        ...contract_source,
      },
    },
  ];

  return contract_source != null ? (
    <Flex width="100%" height="100%" flexDirection="column" overflow="scroll">
      <EditorPublishButton />
      {contracts.map((contract) => {
        return <InteractableContract key={contract.id} contract={contract} />;
      })}
    </Flex>
  ) : null;
}

EditorInteractionView.fragments = {
  contract: gql`
    fragment EditorInteractionViewFragment on ContractSource {
      id
      name
      constructor
      events
      functions
      abi
    }
  `,
};
