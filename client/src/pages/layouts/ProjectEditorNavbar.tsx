import {
  Text,
  Flex,
  Spacer,
  Link,
  HStack,
  Select,
  Box,
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

type Props = {
  project_id: string;
  version_id: string;
};
function ProjectEditorNavbar({ project_id, version_id }: Props) {
  const [selectedVersionIndex, setSelectedVersionIndex] = useState(0);

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
    setSelectedVersionIndex(
      data?.project?.versions?.findIndex((version) => {
        return version?.id === version_id;
      }) || 0
    );
  }, [data, version_id]);

  if (!loading && versions.length === 0) {
    throw new Error("Something went wrong. No versions found for this project");
  }

  return (
    <Flex sx={styles.navbar} flexShrink="0">
      <Box flexGrow="0">
        <Select
          value={(versions && versions[selectedVersionIndex])?.name || "ERROR"}
        >
          {versions?.map((v) => {
            return (
              <option value="option1" key={v?.id}>
                {v?.name}
              </option>
            );
          })}
        </Select>
      </Box>
      <Spacer />
      <NextLink href={`/`} passHref>
        <Link>
          <Logo type="dynamic" />
        </Link>
      </NextLink>
      <Spacer />

      <HStack gap="18px">
        <DiscordLink color={theme.colors.discordPurple} size={20} />
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
