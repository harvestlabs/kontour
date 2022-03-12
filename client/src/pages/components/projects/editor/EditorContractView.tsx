import React, { constructor } from "react";
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

type Props = {};

export default function EditorContractView({}: Props) {
  const contract_source = useAppSelector(selectSelectedContractData);

  let { functions, constructor, events } =
    (contract_source as {
      functions: ContractSourceFunction[];
      constructor: ContractSourceConstructor;
      events: ContractSourceEvent[];
    }) || {};

  return contract_source != null ? (
    <Flex width="100%" height="100%" flexDirection="column" overflow="scroll">
      <Heading>{contract_source.name}</Heading>
      <EditorPublishButton />

      <List spacing={3}>
        {constructor != null && (
          <>
            <ListItem>Constructor</ListItem>
            <Button variant="listItem" onClick={() => {}}>
              <ListItem>
                <ListIcon
                  verticalAlign="middle"
                  as={Icons.Code}
                  color="green.500"
                />
                <Text>
                  constructor(
                  {constructor.inputs?.map((input, idx) => {
                    return (
                      <>
                        <Text as="span">{input.internalType}</Text>{" "}
                        <Text as="span">
                          {input.name}
                          {idx !== constructor.inputs.length - 1 && ", "}
                        </Text>
                      </>
                    );
                  })}
                  )
                </Text>
              </ListItem>
            </Button>
          </>
        )}
        <ListItem>Events</ListItem>;
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
        <ListItem>Functions</ListItem>;
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
    </Flex>
  ) : null;
}

EditorContractView.fragments = {
  contract: gql`
    fragment EditorContractViewFragment on ContractSource {
      id
      name
      constructor
      events
      functions
    }
  `,
};
