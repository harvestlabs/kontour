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
    user_id?: string;
  } = {
    fetchPolicy: "network-only",
  };
  if (user_id != null) {
    queryProps.user_id = user_id;
  }

  const { data, loading, error } = useQuery<ProjectsQuery>(
    PROJECTS,
    queryProps
  );

  const { projects } = data || {};
  console.log("projects", data);

  return projects != null ? (
    <Wrap
      width="100%"
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
  ) : null;
}

ProjectList.fragments = {
  project: gql`
    fragment ProjectListFragment on Project {
      id
    }
  `,
};

export const PROJECTS = gql`
  query ProjectsQuery($user_id: String) {
    projects(user_id: $user_id) {
      id
      ...ProjectPreviewFragment
    }
  }
  ${ProjectPreview.fragments.project}
`;

export default ProjectList;