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
import { gql } from "@apollo/client";
import { VersionContractsListItemFragment } from "@gql/__generated__/VersionContractsListItemFragment";
import EditorContractView from "../editor/EditorContractView";

type Props = { contract_source: VersionContractsListItemFragment };
export default function VersionContractsListItem({ contract_source }: Props) {
  const { id, name } = contract_source;

  const { functions, constructor, events } = contract_source as {
    functions: ContractSourceFunction[];
    constructor: ContractSourceConstructor;
    events: ContractSourceEvent[];
  };
  const dispatch = useDispatch();
  return (
    <AccordionItem>
      <h2>
        <AccordionButton
          onClick={() => {
            dispatch(setSelectedContractData(contract_source));
          }}
        >
          <Box flex="1" textAlign="left">
            {name}
          </Box>
        </AccordionButton>
      </h2>
      <AccordionPanel pr={0} pb={4}>
        <List spacing={3}>
          {constructor != null && (
            <>
              <Button variant="listItem" onClick={() => {}}>
                <ListItem>Constructor</ListItem>
              </Button>
            </>
          )}
          <Button variant="listItem" onClick={() => {}}>
            <ListItem>Events</ListItem>;
          </Button>
          {events.map((event) => {
            return (
              <Button key={event.name} variant="listItem" onClick={() => {}}>
                <ListItem>
                  <ListIcon
                    verticalAlign="middle"
                    as={Icons.Code}
                    color="green.500"
                  />
                  {event.name}
                </ListItem>
              </Button>
            );
          })}
          <Button variant="listItem" onClick={() => {}}>
            <ListItem>Functions</ListItem>;
          </Button>
          {functions.map((func) => {
            return (
              <Button key={func.name} variant="listItem" onClick={() => {}}>
                <ListItem>
                  <ListIcon
                    verticalAlign="middle"
                    as={Icons.Code}
                    color="green.500"
                  />
                  {func.name}
                </ListItem>
              </Button>
            );
          })}
        </List>
      </AccordionPanel>
    </AccordionItem>
  );
}

VersionContractsListItem.fragments = {
  contract: gql`
    fragment VersionContractsListItemFragment on ContractSource {
      id
      name
      constructor
      events
      functions
      ...EditorContractViewFragment
    }
    ${EditorContractView.fragments.contract}
  `,
};
