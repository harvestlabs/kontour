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
  SimpleGrid,
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
import InteractableContract from "./InteractableContract";
import EditorRequestAirdropButton from "./EditorRequestAirdropButton";
import { ProjectVersionQuery_projectVersion_head_instance } from "@gql/__generated__/ProjectVersionQuery";
import { generateKontour } from "src/helpers/generator";
import GlobalContractView from "./GlobalContractView";

type Props = {
  instance?: ProjectVersionQuery_projectVersion_head_instance | null;
};

export default function EditorInteractionView({ instance }: Props) {
  if (instance == null) {
    throw new Error("No test node found for this project");
  }

  return (
    <Flex
      width="100%"
      height="100%"
      flexDirection="column"
      overflow="scroll"
      position="relative"
    >
      <EditorPublishButton />
      <EditorRequestAirdropButton instance_id={instance.id} />

      <VStack>
        {instance.contracts.map((contract) => {
          return <InteractableContract key={contract.id} contract={contract} />;
        })}
        {instance.global_contracts.map((contract) => {
          return <GlobalContractView key={contract.id} contract={contract} />;
        })}
      </VStack>
    </Flex>
  );
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
  instance: gql`
    fragment InstanceFragment on Instance {
      id
      name
      status
      data
      project_id
      project_version_id
      contracts {
        ...InteractableContractFragment
      }
      global_contracts {
        ...InteractableContractFragment
      }
    }
    ${InteractableContract.fragments.contract}
  `,
};
