import { theme } from "@chakra-ui/react";

const contourBlackest = "rgb(20, 24, 32)";
const contourBlacker = "rgb(35, 39, 45)";
const contourWhite = " rgb(171, 178, 191)";
const contourRedLight = "rgb(224, 108, 117)";

const contourGrey = "rgb(76, 82, 99)";
const contourGreyLight = "rgb(92, 99, 112)";

const contourBoxShadow = " 0px 5px 15px 0px rgba(17,18,24,0.7); !important";

const contourBorderGrey = contourGreyLight;
const contourBorderGreyDark = "rgb(56, 61, 70)";
const contourBorderBlack = "rgb(24, 26, 31)";

const discordPurple = " #7289da";

const colorSchemes = {
  contourBlack: {
    0: "#555E6F",
    50: "#4E5665",
    100: "#464D5B",
    200: "#3F4551",
    300: "#373D48",
    400: "#30343E",
    500: "rgb(40, 44, 52)",
    600: "#23272E",
    700: "#1F2228",
    800: "#1B1D23",
    900: "#16181D",
    1000: "#121417",
  },
  contourWhite: {
    500: contourWhite,
  },
  contourRed: {
    0: "#FFFFFF",
    50: "#F4E2E0",
    100: "#E9C5C1",
    200: "#DFA8A3",
    300: "#D48A84",
    400: "#C96D65",
    500: "rgb(190, 80, 70)",
    600: "#AB453C",
    700: "#963D35",
    800: "#80342D",
    900: "#6B2B26",
    1000: "#56231E",
  },
  contourRedLight: {
    0: "#FFFFFF",
    50: "#FAE6E8",
    100: "#F5CED1",
    200: "#EFB5BA",
    300: "#EA9DA3",
    400: "#E5848C",
    500: "rgb(224, 108, 117)",
    600: "#D94D59",
    700: "#D32F3D",
    800: "#B62733",
    900: "#98202A",
    1000: "#7A1A22",
  },
  contourGreen: {
    0: "#FFFFFF",
    50: "#EEF5E9",
    100: "#DDEBD2",
    200: "#CBE1BC",
    300: "#BAD7A6",
    400: "#A9CD90",
    500: "rgb(152, 195, 121)",
    600: "#85B861",
    700: "#73AA4C",
    800: "#639141",
    900: "#527936",
    1000: "#42612C",
  },
  contourYellow: {
    0: "#FFFFFF",
    50: "#F7EEE5",
    100: "#F0DDCC",
    200: "#E8CCB2",
    300: "#E1BC99",
    400: "#D9AB7F",
    500: "rgb(209, 154, 102)",
    600: "#C9884B",
    700: "#BA7738",
    800: "#A06630",
    900: "#855528",
    1000: "#6A4420",
  },
  contourYellowLight: {
    0: "#FFFFFF",
    50: "#FBF4E9",
    100: "#F6EAD3",
    200: "#F2DFBD",
    300: "#EED5A7",
    400: "#E9CA91",
    500: "rgb(229, 192, 123)",
    600: "#DEB05A",
    700: "#D8A13A",
    800: "#C48D27",
    900: "#A37520",
    1000: "#835E1A",
  },
  contourBlue: {
    0: "#FFFFFF",
    50: "#E5F2FC",
    100: "#CAE4FA",
    200: "#B0D7F7",
    300: "#96CAF5",
    400: "#7CBDF2",
    500: "rgb(97, 175, 239)",
    600: "#3F9EEC",
    700: "#1D8DE9",
    800: "#1479CC",
    900: "#1165AA",
    1000: "#0D5188",
  },
  contourPurple: {
    0: "#FFFFFF",
    50: "#F5E9F9",
    100: "#ECD2F4",
    200: "#E2BCEE",
    300: "#D9A5E9",
    400: "#CF8FE3",
    500: "rgb(198, 120, 221)",
    600: "#B95AD6",
    700: "#AC3CCE",
    800: "#962EB6",
    900: "#7D2698",
    1000: "#641E79",
  },
  contourCyan: {
    0: "#FFFFFF",
    50: "#E3F3F5",
    100: "#C7E7EB",
    200: "#ABDAE1",
    300: "#8FCED6",
    400: "#72C2CC",
    500: "rgb(86, 182, 194)",
    600: "#42AAB7",
    700: "#3A94A0",
    800: "#327F89",
    900: "#296A73",
    1000: "#21555C",
  },
  contourGrey: {
    500: contourGrey,
  },
  contourGreyLight: {
    500: contourGreyLight,
  },
  contourBorder: {
    500: contourBorderGrey,
    700: contourBorderGreyDark,
    1000: contourBorderBlack,
  },
};

const colors = {
  ...theme.colors,
  ...colorSchemes,
  contourLink: "contourBlue.500",
  contourBackground: "contourBlack.500",
  contourBackgroundMedium: "contourBlack.700",
  contourBackgroundDarker: "contourBlack.800",
  contourText: "contourWhite.500",
  contourBoxShadow,

  discordPurple,
};

export default colors;
