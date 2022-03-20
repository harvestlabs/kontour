import { theme } from "@chakra-ui/react";

const contourBlackest = "rgb(20, 24, 32)";
const contourBlacker = "rgb(35, 39, 45)";
const contourBlack = "rgb(40, 44, 52)";
const contourWhite = " rgb(171, 178, 191)";
const contourRed = "rgb(190, 80, 70)";
const contourRedLight = "rgb(224, 108, 117)";
const contourGreen = "rgb(152, 195, 121)";
const contourYellow = "rgb(209, 154, 102)";
const contourYellowLight = "rgb(229, 192, 123)";
const contourBlue = "rgb(97, 175, 239)";
const contourPurple = "rgb(198, 120, 221) ";
const contourCyan = "rgb(86, 182, 194)";
const contourGrey = "rgb(76, 82, 99)";
const contourGreyLight = "rgb(92, 99, 112)";
const contourBoxShadow = "rgb(40 40 40 / 20%) 0px 1px 12px !important";

const contourBorderGrey = contourGreyLight;
const contourBorderGreyDark = "rgb(56, 61, 70)";
const contourBorderBlack = "rgb(24, 26, 31)";

const discordPurple = " #7289da";

const colorSchemes = {
  contourBlack: {
    500: contourBlack,
    700: contourBlacker,
    1000: contourBlackest,
  },
  contourWhite: {
    500: contourWhite,
  },
  contourRed: {
    300: contourRedLight,
    500: contourRed,
  },
  contourGreen: {
    500: contourGreen,
  },
  contourYellow: {
    300: contourYellowLight,
    500: contourYellow,
  },
  contourBlue: {
    500: contourBlue,
    600: contourBlue,
  },
  contourPurple: {
    500: contourPurple,
  },
  contourCyan: {
    500: contourCyan,
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
  contourBackgroundDarker: "contourBlack.1000",
  contourText: "contourWhite.500",
  contourBoxShadow,

  discordPurple,
};

export default colors;
