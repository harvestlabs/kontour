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
  Heading,
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
import { useRouter } from "next/router";

type Props = {
  project_id: string;
  version_id: string;
  instance_id?: string;
};
function ProjectEditorNavbar({ project_id, version_id, instance_id }: Props) {
  const [selectedVersionName, setSelectedVersionName] = useState("Loading...");
  const dispatch = useDispatch();
  const router = useRouter();
  console.log("router", router.asPath);

  return (
    <Flex sx={styles.navbar} flexShrink="0">
      <NextLink href={`/`} passHref>
        <Link>
          <Logo type="dynamic" />
        </Link>
      </NextLink>
      <NextLink href={`/versions/${version_id}`} passHref>
        <Link ml="24px">
          <Text fontSize="24px">Sandbox</Text>
        </Link>
      </NextLink>
      <NextLink href={`/versions/${version_id}/logs`} passHref>
        <Link ml="24px">
          <Text fontSize="24px">Event Logs</Text>
        </Link>
      </NextLink>
      <Spacer />
      <Spacer />

      <HStack gap="18px">
        <SignInButton />
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

    boxShadow: colors.contourBoxShadow,
    padding: {
      base: "0 32px",
      md: "0 80px",
    },
    height: {
      base: "52px",
      md: "80px",
    },
    backgroundColor: colors.contourBackgroundDarker,
  },
};

export default ProjectEditorNavbar;
