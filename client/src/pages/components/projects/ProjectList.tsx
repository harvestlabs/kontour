import Head from "next/head";
import Image from "next/image";
import {
  gql,
  useLazyQuery,
  useQuery,
  WatchQueryFetchPolicy,
} from "@apollo/client";
import NextLink from "next/link";

import { Box, Flex, Link, StackProps, Wrap } from "@chakra-ui/react";
import ProjectPreview from "./ProjectPreview";
import { ProjectsQuery } from "@gql/__generated__/ProjectsQuery";

type Props = {
  user_id?: string;
} & StackProps;

function ProjectList({ user_id }: Props) {
  const queryProps: {
    fetchPolicy: WatchQueryFetchPolicy;
  } = {
    fetchPolicy: "network-only",
  };

  const { data, loading, error } = useQuery<ProjectsQuery>(PROJECTS);

  const { projects } = data || {};

  console.log("projects", data);

  return projects != null ? (
    <Flex width="100%">
      <Wrap
        columns={5}
        spacing={{ base: "15px", md: "30px" }}
        alignItems="center"
        justify="center"
      >
        {projects.map((project) =>
          project ? (
            <Box key={project.id}>
              <ProjectPreview project={project} />
            </Box>
          ) : null
        )}
      </Wrap>
    </Flex>
  ) : null;
}

export const PROJECTS = gql`
  query ProjectsQuery {
    projects {
      id
      ...ProjectPreviewFragment
    }
  }
  ${ProjectPreview.fragments.project}
`;

export default ProjectList;
