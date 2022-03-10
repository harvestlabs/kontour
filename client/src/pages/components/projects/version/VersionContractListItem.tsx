import React from "react";
import Footer from "@components/Footer";
import {
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

type Props = { contract: { id: string; name: string; methods: any[] } };
export default function VersionContractsListItem({ contract }: Props) {
  const { id, name, methods } = contract;
  const dispatch = useDispatch();
  return (
    <AccordionItem>
      <h2>
        <AccordionButton
          onClick={() => {
            dispatch(setSelectedContractData(contract));
          }}
        >
          <Box flex="1" textAlign="left">
            {name}
          </Box>
        </AccordionButton>
      </h2>
      <AccordionPanel pr={0} pb={4}>
        <List spacing={3}>
          {methods.map((method) => {
            return (
              <Button key={method} variant="listItem" onClick={() => {}}>
                <ListItem>
                  <ListIcon
                    verticalAlign="middle"
                    as={Icons.Code}
                    color="green.500"
                  />
                  {method}
                </ListItem>
              </Button>
            );
          })}
        </List>
      </AccordionPanel>
    </AccordionItem>
  );
}
