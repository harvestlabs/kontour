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
  Tooltip,
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
  instance_id: string;
  mainnet_node: any;
};
export default function VersionContractsListItem({
  contract_source,
  instance_id,
  mainnet_node,
}: Props) {
  const { id, name, abi, bytecode, source_type } = contract_source;

  const { functions, constructor, events } = contract_source as {
    functions: ContractSourceFunction[];
    constructor: ContractSourceConstructor;
    events: ContractSourceEvent[];
  };
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const [deployedContractToVersion, meta] = useMutation(
    DEPLOY_CONTRACT_TO_INSTANCE
  );

  const openDeployModal = () => {
    setIsOpen(true);
  };
  const deployContract = async (
    abi: any,
    bytecode: string,
    args: any[] = []
  ) => {
    // @ts-ignore
    const { web3, eth, getAccount } = window.kontour;
    if (mainnet_node) {
      await eth.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${mainnet_node.chainId.toString(16)}` }],
      });
    }
    const Contract = new web3.eth.Contract(JSON.parse(JSON.stringify(abi)));

    const transaction = Contract.deploy({ arguments: args, data: bytecode });
    const result = await transaction.send({
      from: getAccount(),
    });
    const address = result.options.address;
    await deployedContractToVersion({
      variables: {
        sourceId: id,
        sourceType: source_type,
        address: address,
        instanceId: instance_id,
        params: args,
      },
    });
    onClose();
    window.location.reload();
  };
  return (
    <Tooltip
      label={"Deploy " + contract_source.name}
      closeOnClick={false}
      placement="top"
    >
      <Flex onClick={openDeployModal} cursor="pointer">
        <ListItem>{contract_source.name}.sol</ListItem>
        <VersionContractDeployModal
          cons={constructor}
          contractName={name}
          isOpen={isOpen}
          cancelRef={cancelRef}
          onClose={onClose}
          onDeploy={(args) => deployContract(abi, bytecode!, args)}
        />
      </Flex>
    </Tooltip>
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
      source_type
      ...EditorContractViewFragment
      ...EditorInteractionViewFragment
    }
    ${EditorContractView.fragments.contract}
    ${EditorInteractionView.fragments.contract}
  `,
};

const DEPLOY_CONTRACT_TO_INSTANCE = gql`
  mutation DeployedContractToInstance(
    $sourceId: String!
    $sourceType: Int!
    $instanceId: String!
    $address: String!
    $params: JSON!
  ) {
    deployedContractToInstance(
      sourceId: $sourceId
      sourceType: $sourceType
      instanceId: $instanceId
      address: $address
      params: $params
    ) {
      id
    }
  }
`;
