import Head from "next/head";
import Image from "next/image";
import {
  gql,
  useLazyQuery,
  useQuery,
  WatchQueryFetchPolicy,
} from "@apollo/client";
import NextLink from "next/link";

import {
  Box,
  Flex,
  Heading,
  Link,
  StackProps,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import ProjectPreview from "./ProjectPreview";
import { ProjectsQuery } from "@gql/__generated__/ProjectsQuery";
import { ProjectVersionsListQuery } from "@gql/__generated__/ProjectVersionsListQuery";
import ProjectVersionPreview from "./ProjectVersionPreview";
import { useRouter } from "next/router";
import CreateDraftVersionButton from "./CreateDraftVersionButton";
import { ProjectVersionsList_project_versions } from "@gql/__generated__/ProjectVersionsList";

type Props = {
  project_id: string;
  versions: ProjectVersionsList_project_versions[];
} & StackProps;

function ProjectVersionsList({ project_id, versions }: Props) {
  const router = useRouter();

  const onCreated = (id: string) => {
    router.push(`/versions/${id}`);
  };

  return (
    <Flex width="100%">
      <VStack
        columns={5}
        spacing={{ base: "15px", md: "30px" }}
        alignItems="flex-start"
        justify="center"
      >
        {versions.map((version) =>
          version ? (
            <ProjectVersionPreview key={project_id} version={version} />
          ) : null
        )}
      </VStack>
    </Flex>
  );
}

export default ProjectVersionsList;
