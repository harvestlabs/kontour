import { extendTheme, theme as defaultTheme } from "@chakra-ui/react";
import colors from "./colors";

const Button = {
  // The styles all button have in common
  baseStyle: {
    lineHeight: "initial",
  },
  // Two sizes: sm and md
  sizes: {
    xs: {
      borderRadius: "12px",
    },
    sm: {
      borderRadius: "16px",
    },
    md: {
      borderRadius: "20px",
    },
    lg: {
      borderRadius: "24px",
    },
    xl: {
      h: "56px",
      borderRadius: "28px",
      fontSize: "lg",
      px: "32px",
    },
  },
  // Two variants: outline and solid
  variants: {
    reject: {
      bg: "red.400",
      color: "white",
    },
    outline: {
      // border: "2px solid",
      // borderColor: "purple.500",
      // color: "purple.500",
    },
    solid: {},
    link: {},
    listItem: {
      ...defaultTheme.components.Button.variants.ghost,
      width: "100%",
      textAlign: "left",
      justifyContent: "flex-start",
      borderRadius: "0",
    },
  },
  // The default size and variant values
  defaultProps: {
    size: "md",
    // variant: "outline",
  },
};

const Text = {
  // The styles all button have in common
  baseStyle: { color: colors.contourText },
  // Two variants: outline and solid
  variants: {
    ellipsis: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      maxWidth: "100%",
    },
    clamp3: {
      display: "-webkit-box",
      WebkitLineClamp: "3",
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
    },
  },
  // The default size and variant values
  defaultProps: {},
};

const Container = {
  variants: {
    editor: { width: "100%", height: "100%" },
    base: {
      padding: {
        sm: "52px",
        md: "80px",
      },
      maxWidth: {
        md: "1080px",
        xl: "1366px",
      },
    },
  },
};

const Heading = {
  baseStyle: {
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    lineHeight: "1.7",
  },
  variants: {
    nocaps: {
      textTransform: "initial",
      fontFamily: "Mukta, sans-serif",
      letterSpacing: "initial",
      lineHeight: "1.4",
    },
  },
};

const Link = {
  baseStyle: {
    color: colors.contourLink,
    _hover: {
      textDecoration: "none",
    },
  },
};

const theme = extendTheme({
  styles: {
    global: {
      // styles for the `body`
      body: {
        padding: 0,
        margin: 0,
        bg: colors.contourBackground,
        color: colors.contourText,
        fontSize: "16px",
      },
      "*": {
        boxSizing: "border-box",
      },
    },
  },
  components: {
    Button,
    Link,
    Text,
    FormLabel: Text,
    Container,
    Heading,
  },
  // mobile
  sm: "768px",
  // tablet
  md: "1024px",
  // desktop
  lg: "1216px",
  // fullhd
  xl: "1408px",
  "2xl": "1600px",
  colors,
  fonts: {
    body: "Mukta, sans-serif",
    heading: "Poppins, sans-serif",
  },
});

export default theme;
