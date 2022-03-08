import { CSSObject, Box, Icon } from "@chakra-ui/react";
import * as React from "react";

type Props = { size: number; sx?: CSSObject };
type SVGProps = { size: number };

const SVG = ({ size }: SVGProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 77.2 85.1"
      className="bounty-svglogo"
      style={{
        height: size,
      }}
      xmlSpace="preserve"
    >
      <path
        d="M5.8 4.1C15.3 30 4.1 64.5 31.1 78c17 8.4 38.1-1.4 41.5-18.8 4.7-23.6-19-47.2-47.3-29.6C21.5 14.8 31.1 4.5 5.8 4.1z"
        style={{
          fill: "white",
        }}
      />
      <path
        d="M70.8 65.7c-13.1-2.1-18.5-14.8-33.2-16.2-8.8-.8-15 2.5-22.5 7.2l2.7 6.5 3.6 6.4 4.6 5.1 7.3 4.3L47 81l10.8-3.1 7.6-5.4 5.4-6.8z"
        style={{
          fill: "#ffe6ad",
        }}
      />
      <path
        d="M5.8 4.1C15.3 30 4.1 64.5 31.1 78c17 8.4 38.1-1.4 41.5-18.8 4.7-23.6-19-47.2-47.3-29.6C21.5 14.8 31.1 4.5 5.8 4.1z"
        style={{
          fill: "none",
          stroke: "#7dc794",
          strokeWidth: 8,
          strokeMiterlimit: 10,
        }}
      />
    </svg>
  );
};
const SVGLogo = ({ size, sx = {} }: Props) => {
  return (
    <Box sx={sx}>
      <Icon size={size} as={SVG} />
    </Box>
  );
};

export default SVGLogo;
