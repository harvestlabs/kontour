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
  Button,
} from "@chakra-ui/react";
import VersionContractsListItem from "./VersionContractListItem";
import * as Icons from "react-feather";
import { gql, useMutation } from "@apollo/client";
import { VersionContractsListFragment } from "@gql/__generated__/VersionContractsListFragment";
import {
  DeployedContractToVersion,
  DeployedContractToVersionVariables,
} from "@gql/__generated__/DeployedContractToVersion";
import {
  CloneSandbox,
  CloneSandboxVariables,
} from "@gql/__generated__/CloneSandbox";

type Props = {
  contract_sources: VersionContractsListFragment[];
  isPublished: boolean;
  versionId: string;
};

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

export default function VersionContractsList({
  contract_sources,
  isPublished,
  versionId,
}: Props) {
  const [deployedContractToVersion, meta] = useMutation<
    DeployedContractToVersion,
    DeployedContractToVersionVariables
  >(DEPLOY_CONTRACT_TO_VERSION);
  const [cloneSandbox, { loading, error }] = useMutation<
    CloneSandbox,
    CloneSandboxVariables
  >(CLONE_SANDBOX);
  const onDeploy = (sourceId: string, sourceType: number) => {
    return async (address: string, params: any[]) => {
      await deployedContractToVersion({
        variables: {
          sourceId: sourceId,
          sourceType: sourceType,
          address: address,
          versionId: versionId,
          params: params,
        },
      });
    };
  };
  const createNewSandbox = async (e: any) => {
    e.stopPropagation();
    await cloneSandbox({
      variables: {
        projectVersionId: versionId,
        name: "New Sandbox",
      },
    });
  };
  return (
    <Flex width="100%" height="100%" flexDirection="column" overflow="scroll">
      <Heading py="24px" justifySelf="center" textAlign="center">
        Contracts
      </Heading>
      <Accordion allowToggle={true}>
        {contract_sources
          .filter((source) => source.source_type !== 1)
          .map((source) => {
            return (
              <VersionContractsListItem
                key={source.id}
                contract_source={source}
                onDeploy={onDeploy(source.id, source.type)}
              />
            );
          })}
      </Accordion>

      <Spacer />
      {true ? (
        <Accordion allowToggle={true}>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  Sandboxes
                </Box>
                <Button
                  colorScheme="orange"
                  onClick={(e) => createNewSandbox(e)}
                >
                  New Sandbox
                </Button>
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
      ) : null}
    </Flex>
  );
}

VersionContractsList.fragments = {
  contract: gql`
    fragment VersionContractsListFragment on ContractSource {
      id
      type
      source_type
      ...VersionContractsListItemFragment
    }
    ${VersionContractsListItem.fragments.contract}
  `,
};

const DEPLOY_CONTRACT_TO_VERSION = gql`
  mutation DeployedContractToVersion(
    $sourceId: String!
    $sourceType: Int!
    $versionId: String!
    $address: String!
    $params: JSON!
  ) {
    deployedContractToVersion(
      sourceId: $sourceId
      sourceType: $sourceType
      versionId: $versionId
      address: $address
      params: $params
    ) {
      id
    }
  }
`;

const CLONE_SANDBOX = gql`
  mutation CloneSandbox($projectVersionId: String!, $name: String!) {
    cloneSandbox(projectVersionId: $projectVersionId, name: $name) {
      id
    }
  }
`;
