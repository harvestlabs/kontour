import {
  Text,
  Flex,
  Spacer,
  Link,
  HStack,
  Select,
  Box,
  Menu,
  Button,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { PropsWithChildren, useEffect, useState } from "react";
import theme from "src/theme";
import NextLink from "next/link";
import DiscordLink from "@components/buttons/DiscordLink";
import Logo from "@components/logo/Logo";
import SignInButton from "@components/buttons/SignInButton";
import colors from "src/theme/colors";
import MetamaskButton from "@components/buttons/MetamaskButton";
import { gql, useQuery } from "@apollo/client";
import { ProjectEditorNavbarFragment } from "@gql/__generated__/ProjectEditorNavbarFragment";
import {
  ProjectQuery,
  ProjectQueryVariables,
} from "@gql/__generated__/ProjectQuery";
import { setSelectedVersionId } from "@redux/slices/projectSlice";
import { useDispatch } from "react-redux";
import * as Icons from "react-feather";
import EditorInstanceSelector from "@components/projects/editor/navbar/EditorInstanceSelector";

type Props = {
  project_id: string;
  version_id: string;
};
function ProjectEditorNavbar({ project_id, version_id }: Props) {
  const [selectedVersionName, setSelectedVersionName] = useState("Loading...");
  const dispatch = useDispatch();

  const { data, loading, error } = useQuery<
    ProjectQuery,
    ProjectQueryVariables
  >(PROJECT, {
    fetchPolicy: "network-only",
    variables: {
      project_id: project_id,
    },
  });

  const versions = data?.project?.versions || [];

  useEffect(() => {
    setSelectedVersionName(
      data?.project?.versions?.find((version) => {
        return version?.id === version_id;
      })?.name || ""
    );
  }, [data, version_id]);

  if (!loading && versions.length === 0) {
    throw new Error("Something went wrong. No versions found for this project");
  }

  return (
    <Flex sx={styles.navbar} flexShrink="0">
      <NextLink href={`/`} passHref>
        <Link>
          <Logo type="dynamic" />
        </Link>
      </NextLink>
      <Flex flexGrow="0" flexDirection="row" alignItems="center">
        <Text mr="12px">Version:</Text>
        <Menu>
          <MenuButton
            borderRadius="0"
            as={Button}
            rightIcon={<Icons.ChevronDown size="16" />}
          >
            {selectedVersionName || "ERROR"}
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
        <Text mr="12px">Instance:</Text>
        <EditorInstanceSelector version_id={version_id} />
      </Flex>
      <Spacer />
      <Spacer />

      <HStack gap="18px">
        <SignInButton />
        <MetamaskButton />
      </HStack>
    </Flex>
  );
}

ProjectEditorNavbar.fragments = {
  project: gql`
    fragment ProjectEditorNavbarFragment on Project {
      versions {
        id
        name
      }
    }
  `,
};

const styles = {
  navbar: {
    zIndex: 1000,
    alignItems: "center",

    boxShadow: "rgb(0 0 0 / 8%) 0px 1px 12px !important",
    padding: {
      base: "0 32px",
      md: "0 80px",
    },
    height: {
      base: "52px",
      md: "80px",
    },
    backgroundColor: colors.contourBackground,
  },
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

export default ProjectEditorNavbar;
