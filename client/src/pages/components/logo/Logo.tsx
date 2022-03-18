import { Flex, FlexProps, Text } from "@chakra-ui/react";
import SVGLogo from "./SVGLogo";
import { useBreakpointValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import theme from "src/theme";

enum LogoType {
  icon = "icon",
  text = "text",
  full = "full",
  // it will dynamically only show the icon on the tablet or mobile
  dynamic = "dynamic",
}

type LogoTypeString = keyof typeof LogoType;

type Props = {
  type: LogoTypeString;
  breakpoints?: {
    base: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
} & FlexProps;

export default function Logo({
  type,
  breakpoints = {
    base: 28,
    sm: 28,
    md: 40,
  },
  ...props
}: Props) {
  const [svgSize, setSvgSize] = useState(0);
  const breakpointSize = useBreakpointValue(breakpoints);
  useEffect(() => {
    // bug with breakpointSize and SSR
    setSvgSize(breakpointSize || 0);
  }, [breakpointSize]);

  switch (type) {
    case LogoType.text:
      return (
        <Flex sx={styles.logo} {...props}>
          <Text sx={styles.logoText}>bounty</Text>
        </Flex>
      );
    case LogoType.full:
      return (
        <Flex sx={styles.logo} {...props}>
          <SVGLogo size={svgSize} />
        </Flex>
      );
    case LogoType.dynamic:
      return (
        <Flex sx={styles.logo} {...props}>
          <SVGLogo size={svgSize} />
        </Flex>
      );
    case LogoType.icon:
      return (
        <Flex sx={styles.logo} {...props}>
          <SVGLogo size={svgSize} />
        </Flex>
      );
    default:
      throw new Error(`Improper string used for logo type: ${type}`);
  }
}

const styles = {
  logo: {
    fontFamily: '"Averia Sans Libre", cursive',
    color: theme.colors.bountyBrownDark,
  },
  logoIconWithText: {
    ".bounty-svglogo": {
      marginRight: "12px",
    },
  },
  logoText: {
    display: "flex",
    alignItems: "center",
    fontSize: "28px",
  },
  logoSuperscript: {
    verticalAlign: "super",
    fontSize: "100%",
    alignSelf: "baseline",
    marginLeft: "4px",
    lineHeight: "initial",
    top: 0,
  },
  dynamicHidden: {
    display: { sm: "none", md: "block" },
  },
};
