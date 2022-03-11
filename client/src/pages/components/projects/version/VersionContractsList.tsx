import React from "react";
import Footer from "@components/Footer";
import {
  Text,
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Heading,
  List,
  ListIcon,
  ListItem,
  Spacer,
} from "@chakra-ui/react";
import VersionContractsListItem from "./VersionContractListItem";
import * as Icons from "react-feather";
import { gql } from "@apollo/client";
import { VersionContractsListFragment } from "@gql/__generated__/VersionContractsListFragment";

type Props = { contract_sources: VersionContractsListFragment[] };

const mockSandboxes = [
  {
    id: "0",
    name: "Instance 1",
  },
  {
    id: "1",
    name: "Instance 2",
  },
  {
    id: "2",
    name: "Instance 3",
  },
  {
    id: "3",
    name: "Instance 4",
  },
  {
    id: "4",
    name: "Instance 5",
  },
];

export default function VersionContractsList({ contract_sources }: Props) {
  return (
    <Flex width="100%" height="100%" flexDirection="column">
      <Heading py="24px" justifySelf="center" textAlign="center">
        Contracts
      </Heading>
      <Accordion allowToggle={true}>
        {contract_sources.map((source) => {
          return (
            <VersionContractsListItem
              key={source.id}
              contract_source={source}
            />
          );
        })}
      </Accordion>

      <Spacer />
      <Accordion allowToggle={true}>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Sandboxes
              </Box>
            </AccordionButton>
          </h2>
          <AccordionPanel pr={0} pb={4}>
            <List spacing={3}>
              {mockSandboxes.map((instance) => {
                return (
                  <ListItem
                    key={instance.id}
                    display="flex"
                    alignItems="center"
                  >
                    <Text>{instance.name}</Text>
                    <Spacer />
                    <Text>Load Instance</Text>
                    <ListIcon
                      ml="8px"
                      verticalAlign="middle"
                      as={Icons.UploadCloud}
                      color="green.500"
                    />
                  </ListItem>
                );
              })}
            </List>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Flex>
  );
}

VersionContractsList.fragments = {
  contract: gql`
    fragment VersionContractsListFragment on ContractSource {
      id
      ...VersionContractsListItemFragment
    }
    ${VersionContractsListItem.fragments.contract}
  `,
};
