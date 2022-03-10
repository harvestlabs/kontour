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
import VersionContractsCreateItemButton from "./VersionContractsCreateItemButton";
import * as Icons from "react-feather";

type Props = {};

const mockInstances = [
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
const mock = [
  {
    id: "1",
    name: "Machine.sol",
    methods: ["macreate", "join", "withdraw", "negotiate"],
  },
  {
    id: "2",
    name: "Bounty.sol",
    methods: ["bcreate", "join", "withdraw", "negotiate"],
  },
  {
    id: "3",
    name: "Treasury.sol",
    methods: ["tcreate", "join", "withdraw", "negotiate"],
  },
  {
    id: "4",
    name: "Mint.sol",
    methods: ["mcreate", "join", "withdraw", "negotiate"],
  },
];

export default function VersionContractsList({
  children,
}: React.PropsWithChildren<Props>) {
  return (
    <Flex width="100%" height="100%" flexDirection="column">
      <Heading py="24px" justifySelf="center" textAlign="center">
        Contracts
      </Heading>
      <VersionContractsCreateItemButton />
      <Accordion allowToggle={true}>
        {mock.map((contract) => {
          return (
            <VersionContractsListItem key={contract.id} contract={contract} />
          );
        })}
      </Accordion>

      <Spacer />
      <Accordion allowToggle={true}>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Deployed Instances
              </Box>
            </AccordionButton>
          </h2>
          <AccordionPanel pr={0} pb={4}>
            <List spacing={3}>
              {mockInstances.map((instance) => {
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
