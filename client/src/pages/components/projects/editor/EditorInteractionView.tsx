import React, { useEffect, useState } from "react";
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
      id: "6fad925c-d243-4947-a3d4-229cd7687309",
      address: "0x115ec7873BF8A7BD118f269E80d4EBbbF589Bab2",
      contractSource: {
        __typename: "ContractSource",
        id: "afe1bd94-1e9a-4032-ae1b-d72df116162e",
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
