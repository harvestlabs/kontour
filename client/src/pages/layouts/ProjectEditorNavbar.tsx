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
  instance_id?: string;
  sdk_url?: string;
};
function ProjectEditorNavbar({
  project_id,
  version_id,
  instance_id,
  sdk_url,
}: Props) {
  const [selectedVersionName, setSelectedVersionName] = useState("Loading...");
  const dispatch = useDispatch();

  return (
    <Flex sx={styles.navbar} flexShrink="0">
      <NextLink href={`/`} passHref>
        <Link>
          <Logo type="dynamic" />
        </Link>
      </NextLink>
      {sdk_url ? <Link href={sdk_url}>Get the SDK</Link> : null}
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

export default ProjectEditorNavbar;
