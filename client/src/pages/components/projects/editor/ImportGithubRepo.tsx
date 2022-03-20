import { gql, useMutation, useQuery } from "@apollo/client";
import Fuse from "fuse.js";
import { Text, Box, Icon } from "@chakra-ui/react";
import {
  AddRepoAndCreateProject,
  AddRepoAndCreateProjectVariables,
} from "@gql/__generated__/AddRepoAndCreateProject";

import { Repos } from "@gql/__generated__/Repos";
import { useMemo, useState } from "react";
import colors from "src/theme/colors";
import React from "react";
import Search from "@components/lib/Search";
import { GitHub } from "react-feather";

const GITHUB_REPOS = gql`
  query Repos {
    searchGithubRepos
  }
`;

const ADD_REPO_AND_CREATE_PROJECT = gql`
  mutation AddRepoAndCreateProject($repo_name: String!, $handle: String!) {
    addRepoAndCreateProject(repo_name: $repo_name, handle: $handle) {
      id
      versions {
        id
      }
    }
  }
`;

interface Props {
  onCreated: (id: string) => void;
}

function ImportGithubRepo({ onCreated }: Props) {
  const [searchValue, setSearchValue] = useState("");
  const { data: repos, loading, error } = useQuery<Repos>(GITHUB_REPOS);
  const [addRepo, e1] = useMutation<
    AddRepoAndCreateProject,
    AddRepoAndCreateProjectVariables
  >(ADD_REPO_AND_CREATE_PROJECT);

  return (
    <>
      <Search
        data={repos?.searchGithubRepos || []}
        isLoading={loading}
        searchPlaceholder="Search for a repo"
        maxResultsHeight="200px"
        width="800px"
      >
        {({ key, item: repo }) => {
          return (
            <Box
              key={key}
              padding="10px"
              borderBottom={`1px solid ${colors.contourBorder[500]}`}
              _hover={{ bg: "contourBlue.100", color: "contourBlue.1000" }}
              cursor="pointer"
              onClick={async () => {
                const project = await addRepo({
                  variables: {
                    handle: repo.handle,
                    repo_name: repo.repo_name,
                  },
                });
                onCreated(project.data?.addRepoAndCreateProject?.id!);
              }}
            >
              <Text
                as="span"
                color={colors.contourRedLight[500]}
                fontWeight="700"
              >
                <Icon stroke={colors.white} as={GitHub} mx="6px" />
                {repo.handle}/{repo.repo_name}
              </Text>
            </Box>
          );
        }}
      </Search>
    </>
  );
}

export default ImportGithubRepo;
