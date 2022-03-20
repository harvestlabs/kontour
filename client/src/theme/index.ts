import {
  extendTheme,
  theme as defaultTheme,
  withDefaultColorScheme,
} from "@chakra-ui/react";
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
  baseStyle: {},
  // Two variants: outline and solid
  variants: {
    code: {
      fontFamily:
        "Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;",
      fontSize: "0.9em",
    },
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
      minHeight: "100vh",
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

const Input = {
  baseStyle: {
    field: {
      borderColor: "blue",
      backgroundColor: `${colors.contourBlack["700"]} !important`,
    },
  },
  sizes: {
    sm: {
      field: {},
    },
  },
};

const AlertDialog = {
  baseStyle: {
    field: {
      backgroundColor: `${colors.contourBlack["700"]} !important`,
    },
  },
  sizes: {
    sm: {
      field: {},
    },
  },
};

const Code = {};

// const TextColorScheme: {
//   titleHeader: {};
// };

const Table = {
  parts: ["table", "thead", "tbody", "tr", "th", "td", "tfoot", "caption"],
  baseStyle: {
    caption: {
      px: 0,
      p: 0,
    },
    th: {
      borderColor: "contourBorder.500",
      height: "60px",
      px: 0,
      p: 0,
    },
    td: {
      "border-bottom": `1px solid ${colors.contourBorder["700"]} !important`,
      px: 0,
      p: 0,
    },
  },
};

const theme = extendTheme({
  layerStyles: {
    blue: {
      color: "contourBlue.500",
    },
    purple: {
      color: "contourPurple.500",
    },
    red: {
      color: "contourRed.500",
    },
    cyan: {
      color: "contourCyan.500",
    },
    redLight: {
      color: "contourRedLight.500",
    },
    green: {
      color: "contourGreen.500",
    },
    green800: {
      color: "contourGreen.800",
    },
    yellow: {
      color: "contourYellow.500",
    },
    yellowLight: {
      color: "contourYellowLight.500",
    },
    error: {
      color: "contourRed.500",
    },
    warning: {
      color: "contourYellow.500",
    },
    success: {
      color: "green.500",
    },
    link: {
      color: "contourBlue.500",
    },
    info: {
      color: "contourGreen.500",
    },
    info2: {
      color: "contourRedLight.500",
    },

    event: {
      color: "contourPurple.500",
    },
    title: {
      color: "contourCyan.500",
    },
    subtitle: {
      color: "contourRedLight.500",
    },
    type: {
      color: "contourYellowLight.500",
    },
    function: {
      color: "contourBlue.500",
    },
    value: {
      color: "contourYellow.500",
    },
    title2: {
      color: "contourYellow.500",
    },
    subtitle2: {
      color: "contourBlue.500",
    },
    type2: {
      color: "contourYellowLight.500",
    },
    function2: {
      color: "contourPurple.500",
    },
    value2: {
      color: "contourCyan.500",
    },
  },
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
    Table,
    Input,
    AlertDialog,
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
