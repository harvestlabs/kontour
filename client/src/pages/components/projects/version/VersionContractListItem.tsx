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
  onDeploy: (address: string, params: any[]) => Promise<void>;
};
export default function VersionContractsListItem({
  contract_source,
  onDeploy,
}: Props) {
  const { id, name, abi, bytecode } = contract_source;

  const { functions, constructor, events } = contract_source as {
    functions: ContractSourceFunction[];
    constructor: ContractSourceConstructor;
    events: ContractSourceEvent[];
  };
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const openDeployModal = (e: any) => {
    e.stopPropagation();
    setIsOpen(true);
  };
  const deployContract = async (
    abi: any,
    bytecode: string,
    args: any[] = []
  ) => {
    // @ts-ignore
    const { web3, getAccount } = window.kontour;
    const Contract = new web3.eth.Contract(JSON.parse(JSON.stringify(abi)));

    const transaction = Contract.deploy({ arguments: args, data: bytecode });
    const account = getAccount();
    const g = await transaction.estimateGas({ from: account });
    const result = await transaction.send({
      from: account,
      gas: Math.round(g * 1.25),
    });
    const address = result.options.address;
    await onDeploy(address, args);
    onClose();
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
          <Button colorScheme="blue" onClick={(e) => openDeployModal(e)}>
            Deploy
          </Button>
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
      <VersionContractDeployModal
        cons={constructor}
        contractName={name}
        isOpen={isOpen}
        cancelRef={cancelRef}
        onClose={onClose}
        onDeploy={(args) => deployContract(abi, bytecode!, args)}
      />
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
      bytecode
      ...EditorContractViewFragment
      ...EditorInteractionViewFragment
    }
    ${EditorContractView.fragments.contract}
    ${EditorInteractionView.fragments.contract}
  `,
};
