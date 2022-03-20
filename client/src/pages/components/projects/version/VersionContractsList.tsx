import React, { useEffect, useRef, useState } from "react";
import Footer from "@components/Footer";
import {
  Menu,
  Icon,
  Tooltip,
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
  Divider,
  MenuButton,
  MenuItem,
  MenuList,
  HStack,
  Link,
  AccordionIcon,
  IconButton,
} from "@chakra-ui/react";
import VersionContractsListItem from "./VersionContractListItem";
import * as Icons from "react-feather";
import { gql, useMutation, useQuery } from "@apollo/client";
import { VersionContractsListFragment } from "@gql/__generated__/VersionContractsListFragment";
import {
  DeployedContractToVersion,
  DeployedContractToVersionVariables,
} from "@gql/__generated__/DeployedContractToVersion";
import {
  CloneSandbox,
  CloneSandboxVariables,
} from "@gql/__generated__/CloneSandbox";
import VersionDeployedContractListItem from "./VersionDeployedContractListItem";
import { VersionContractsListInstanceFragment } from "@gql/__generated__/VersionContractsListInstanceFragment";
import EditorRequestAirdropButton from "../editor/EditorRequestAirdropButton";
import { versions } from "process";
import {
  ProjectQuery,
  ProjectQueryVariables,
} from "@gql/__generated__/ProjectQuery";
import { setSelectedVersionId } from "@redux/slices/projectSlice";
import EditorInstanceSelector from "../editor/navbar/EditorInstanceSelector";
import { useDispatch } from "react-redux";
import MetamaskButton from "@components/buttons/MetamaskButton";
import colors from "src/theme/colors";
import { motion } from "framer-motion";

type Props = {
  contract_sources: VersionContractsListFragment[];
  isPublished: boolean;
  projectId: string;
  versionId: string;
  instance: VersionContractsListInstanceFragment;
  sdk_url?: string;
};

export default function VersionContractsList({
  contract_sources,
  projectId,
  versionId,
  isPublished,
  instance,
  sdk_url,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [sdkCopied, setSdkCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [selectedVersionName, setSelectedVersionName] = useState("Loading...");
  const dispatch = useDispatch();

  const { data, loading, error } = useQuery<
    ProjectQuery,
    ProjectQueryVariables
  >(PROJECT, {
    fetchPolicy: "network-only",
    variables: {
      project_id: projectId,
    },
  });
  const versions = data?.project?.versions || [];
  const contracts = instance.contracts.filter(
    (c) => c.contractSource.source_type !== 1
  );
  const libraries = instance.contracts.filter(
    (c) => c.contractSource.source_type === 1
  );

  useEffect(() => {
    setSelectedVersionName(
      data?.project?.versions?.find((version) => {
        return version?.id === versionId;
      })?.name || ""
    );
  }, [data, versionId]);

  if (!loading && versions.length === 0) {
    throw new Error("Something went wrong. No versions found for this project");
  }

  return (
    <Flex
      opacity="50%"
      width="320px"
      maxHeight="80%"
      flexDirection="column"
      bgColor={colors.contourBackgroundDarker}
      position="fixed"
      right="24px"
      top="104px"
      p="24px"
      height={expanded ? "80%" : "auto"}
      transition="opacity .2s ease-in-out"
      boxShadow="0px 0px 20px rgba(0,0,0,0.12)"
      _hover={{
        opacity: "100%",
      }}
    >
      <Tooltip
        label={expanded ? "Minimize Toolkit" : "Maximize Toolkit"}
        closeOnClick={false}
        placement="top"
      >
        <Flex
          alignItems="center"
          mb="12px"
          cursor="pointer"
          onClick={() => {
            setExpanded(!expanded);
          }}
        >
          <Heading layerStyle="title" fontSize="24px">
            Toolkit
          </Heading>

          <Spacer />
          {expanded ? (
            <Icons.Minimize2 size="20px" strokeWidth="3px" />
          ) : (
            <Icons.Maximize2 size="20px" strokeWidth="3px" />
          )}
          <Spacer />
          <MetamaskButton size="sm" ml="12px" />
        </Flex>
      </Tooltip>
      <Divider mb="12px" />
      <Box mb="8px">
        <Heading
          fontSize="18px"
          textAlign="left"
          variant="nocaps"
          alignItems="center"
          display="flex"
          mb="8px"
        >
          <Flex layerStyle="purple" alignItems="center">
            <Icons.Cloud size="18px" />
            <Text as="span" ml="8px">
              Deployed Contracts
            </Text>
          </Flex>
        </Heading>
        <List px="24px">
          {contracts.map((contract) => {
            return (
              <VersionDeployedContractListItem
                contract={contract}
                key={contract.id}
              />
            );
          })}
        </List>
      </Box>
      <Box mb="8px">
        <Heading
          fontSize="18px"
          textAlign="left"
          variant="nocaps"
          alignItems="center"
          display="flex"
          mb="8px"
        >
          <Flex layerStyle="purple" alignItems="center">
            <Icons.Cloud size="18px" />
            <Text as="span" ml="8px">
              Deployed Libraries
            </Text>
          </Flex>
        </Heading>
        <List px="24px">
          {libraries.map((lib) => {
            return (
              <VersionDeployedContractListItem contract={lib} key={lib.id} />
            );
          })}
        </List>
      </Box>
      <Box
        overflow="hidden"
        as={motion.div}
        animate={{
          height: expanded ? "auto" : "50px",
          marginBottom: expanded ? "24px" : "6px",
        }}
      >
        <Heading
          layerStyle="yellow"
          mt="12px"
          mb="8px"
          fontSize="18px"
          textAlign="left"
          variant="nocaps"
          alignItems="center"
          display="flex"
        >
          <Icons.Book size="18px" />
          <Text as="span" ml="8px">
            Project API
          </Text>
        </Heading>
        <List px="24px">
          {contract_sources.map((contract_source) => {
            return (
              <VersionContractsListItem
                contract_source={contract_source}
                key={contract_source.id}
                instance_id={instance.id}
              />
            );
          })}
        </List>
      </Box>
      <Spacer />
      <HStack
        overflow="hidden"
        flexShrink="0"
        as={motion.div}
        animate={{
          height: expanded ? "auto" : 0,
          marginBottom: expanded ? "24px" : 0,
        }}
      >
        <Menu>
          <MenuButton
            size="sm"
            borderRadius="0"
            as={Button}
            rightIcon={<Icons.ChevronDown size="16" />}
            flexShrink="0"
          >
            <Text variant="ellipsis">{selectedVersionName || "ERROR"}</Text>
          </MenuButton>

          <MenuList>
            {versions?.map((v) => {
              const name = v?.name;
              return name != null ? (
                <MenuItem
                  value={v?.id}
                  key={v?.id}
                  onClick={() => {
                    setSelectedVersionName(name);
                    dispatch(setSelectedVersionId(v.id));
                  }}
                >
                  {name}
                </MenuItem>
              ) : null;
            })}
          </MenuList>
        </Menu>
        <EditorInstanceSelector
          version_id={versionId}
          instance_id={instance.id}
        />
      </HStack>
      <HStack>
        {sdk_url ? (
          <Tooltip
            label={!sdkCopied ? "Click to copy" : "URL Copied!"}
            closeOnClick={false}
            placement="left"
          >
            <Button
              colorScheme="green"
              onClick={() => {
                if (timeoutRef.current !== null) {
                  clearTimeout(timeoutRef.current);
                }

                navigator.clipboard.writeText(sdk_url);
                clearTimeout();
                setSdkCopied(true);
                timeoutRef.current = setTimeout(() => {
                  timeoutRef.current = null;
                  setSdkCopied(false);
                }, 3000);
              }}
              leftIcon={<Icons.BookOpen size="18px" />}
              size="sm"
            >
              Javascript SDK
            </Button>
          </Tooltip>
        ) : null}

        <Spacer />
        <EditorRequestAirdropButton
          instance_id={instance.id}
          size="sm"
          flexShrink="0"
        />
      </HStack>
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

  instance: gql`
    fragment VersionContractsListInstanceFragment on Instance {
      id
      name
      status
      data
      project_id
      project_version_id
      contracts {
        id
        ...VersionDeployedContractListItemFragment
      }
      global_contracts {
        id
        ...VersionDeployedContractListItemFragment
      }
    }
    ${VersionDeployedContractListItem.fragments.contract}
  `,
};

export const PROJECT = gql`
  query ProjectQuery($project_id: String!) {
    project(id: $project_id) {
      id
      versions {
        id
        name
      }
    }
  }
`;
