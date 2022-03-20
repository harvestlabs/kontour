import { gql, useMutation, useQuery } from "@apollo/client";
import Fuse from "fuse.js";
import { Text, Box } from "@chakra-ui/react";
import {
  AddRepoAndCreateProject,
  AddRepoAndCreateProjectVariables,
} from "@gql/__generated__/AddRepoAndCreateProject";

import { Repos } from "@gql/__generated__/Repos";
import { useMemo, useState } from "react";
import colors from "src/theme/colors";
import React from "react";
import Search from "@components/lib/Search";

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
        placeholder="Find a repo..."
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
              <Text>{repo.repo_name}</Text>
            </Box>
          );
        }}
      </Search>
    </>
  );
}

export default ImportGithubRepo;
