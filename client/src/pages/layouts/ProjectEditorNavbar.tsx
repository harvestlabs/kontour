import {
  Text,
  Flex,
  Spacer,
  Link,
  HStack,
  Select,
  Box,
} from "@chakra-ui/react";
import { PropsWithChildren, useState } from "react";
import theme from "src/theme";
import NextLink from "next/link";
import DiscordLink from "@components/buttons/DiscordLink";
import Logo from "@components/logo/Logo";
import SignInButton from "@components/buttons/SignInButton";
import colors from "src/theme/colors";
import MetamaskButton from "@components/buttons/MetamaskButton";
import { gql } from "@apollo/client";
import { ProjectEditorNavbarFragment } from "@gql/__generated__/ProjectEditorNavbarFragment";

type Props = {
  project: ProjectEditorNavbarFragment;
};
function ProjectEditorNavbar({
  project: { versions },
}: PropsWithChildren<Props>) {
  const [selectedVersionIndex, setSelectedVersionIndex] = useState(0);

  if (versions?.length === 0) {
    throw new Error("Something went wrong. No versions found for this project");
  }

  return (
    <Flex sx={styles.navbar}>
      <Box flexGrow="0">
        <Select
          placeholder={
            (versions && versions[selectedVersionIndex])?.name || "ERROR"
          }
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

export default ProjectEditorNavbar;
