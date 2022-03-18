import React from "react";
import Footer from "@components/Footer";
import {
  Text,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Heading,
  List,
  ListIcon,
  ListItem,
} from "@chakra-ui/react";
import * as Icons from "react-feather";
import { setSelectedContractData } from "@redux/slices/projectSlice";
import { useDispatch } from "react-redux";
import { gql, useMutation } from "@apollo/client";
import { VersionContractsListItemFragment } from "@gql/__generated__/VersionContractsListItemFragment";
import EditorContractView from "../editor/EditorContractView";
import EditorInteractionView from "../editor/EditorInteractionView";
import VersionContractDeployModal from "./VersionContractDeployModal";

type Props = {
  contract_source: VersionContractsListItemFragment;
};
export default function VersionContractsListItem({ contract_source }: Props) {
  return <ListItem>{contract_source.name}.sol</ListItem>;
}

VersionContractsListItem.fragments = {
  contract: gql`
    fragment VersionContractsListItemFragment on ContractSource {
      id
      name
      constructor
      events
      functions
      bytecode
      ...EditorContractViewFragment
      ...EditorInteractionViewFragment
    }
    ${EditorContractView.fragments.contract}
    ${EditorInteractionView.fragments.contract}
  `,
};
