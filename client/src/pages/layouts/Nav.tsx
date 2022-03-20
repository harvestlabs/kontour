import { Text, Flex, Spacer, Link, HStack } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import theme from "src/theme";
import NextLink from "next/link";
import { useAppSelector } from "src/redux/hooks";
import { selectTwitterHandle } from "@redux/slices/userSlice";
import DiscordLink from "@components/buttons/DiscordLink";
import Logo from "@components/logo/Logo";
import SignInButton from "@components/buttons/SignInButton";
import colors from "src/theme/colors";
import MetamaskButton from "@components/buttons/MetamaskButton";

function StickyHeader({}: PropsWithChildren<{}>) {
  return (
    <Flex sx={styles.sticky}>
      <NextLink href={`/`} passHref>
        <Link>
          <Logo type="dynamic" />
        </Link>
      </NextLink>
      <Spacer />

      <HStack gap="18px">
        <SignInButton />
      </HStack>
    </Flex>
  );
}

const styles = {
  sticky: {
    zIndex: 1000,
    top: 0,
    left: 0,
    position: "fixed",
    right: 0,
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

export default StickyHeader;
