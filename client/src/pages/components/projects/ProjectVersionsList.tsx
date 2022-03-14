import Head from "next/head";
import Image from "next/image";
import {
  gql,
  useLazyQuery,
  useQuery,
  WatchQueryFetchPolicy,
} from "@apollo/client";
import NextLink from "next/link";

import { Box, Flex, Link, StackProps, VStack, Wrap } from "@chakra-ui/react";
import ProjectPreview from "./ProjectPreview";
import { ProjectsQuery } from "@gql/__generated__/ProjectsQuery";
import { ProjectVersionsListQuery } from "@gql/__generated__/ProjectVersionsListQuery";
import ProjectVersionPreview from "./ProjectVersionPreview";

type Props = {
  project_id: string;
} & StackProps;

function ProjectVersionsList({ project_id }: Props) {
  const { data, loading, error } = useQuery<ProjectVersionsListQuery>(
    PROJECT_VERSIONS,
    {
      fetchPolicy: "network-only",
      variables: {
        project_id,
      },
    }
  );

  const { project } = data || {};
  console.log("projects", data, project_id);

  return (
    <Flex width="100%">
      {project != null ? (
        <VStack
          columns={5}
          spacing={{ base: "15px", md: "30px" }}
          alignItems="flex-start"
          justify="center"
        >
          {project?.versions?.map((version) =>
            version ? (
              <Box key={project.id}>
                <ProjectVersionPreview version={version} />
              </Box>
            ) : null
          )}
        </VStack>
      ) : (
        "no project found"
      )}
    </Flex>
  );
}

export const PROJECT_VERSIONS = gql`
  query ProjectVersionsListQuery($project_id: String!) {
    project(id: $project_id) {
      id
      versions {
        id
        name
        ...ProjectVersionPreviewFragment
      }
    }
  }
  ${ProjectVersionPreview.fragments.version}
`;

export default ProjectVersionsList;
