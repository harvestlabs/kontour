import { gql, useMutation, useQuery } from "@apollo/client";
import {
  Box,
  Button,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { AddRepo, AddRepoVariables } from "@gql/__generated__/AddRepo";
import {
  AddRepoAndCreateProject,
  AddRepoAndCreateProjectVariables,
} from "@gql/__generated__/AddRepoAndCreateProject";

import { Repos } from "@gql/__generated__/Repos";
import * as Icons from "react-feather";

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
  const { data: repos, loading, error } = useQuery<Repos>(GITHUB_REPOS);
  const [addRepo, e1] = useMutation<
    AddRepoAndCreateProject,
    AddRepoAndCreateProjectVariables
  >(ADD_REPO_AND_CREATE_PROJECT);

  return (
    <Menu>
      <MenuButton
        borderRadius="0"
        as={Button}
        rightIcon={<Icons.ChevronDown size="16" />}
      >
        New project
      </MenuButton>

      <MenuList>
        {repos?.searchGithubRepos?.map((repo: any) => {
          return (
            <MenuItem
              value={repo.full_repo_name}
              key={repo.full_repo_name}
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
              {repo.full_repo_name}
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
}

export default ImportGithubRepo;
