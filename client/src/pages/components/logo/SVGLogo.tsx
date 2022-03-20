import * as React from "react";
type SVGProps = { size: number };

const SvgComponent = ({ size }: SVGProps) => (
  <svg
    data-name="Layer 1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 214 214"
    style={{
      height: size,
    }}
  >
    <circle
      cx={107}
      cy={107}
      r={25}
      style={{
        fill: "#dfddef",
      }}
    />
    <path
      d="M32.6 41a99.49 99.49 0 0 1 148.81 0l-29.63 29.79"
      style={{
        stroke: "#69addf",
        fill: "none",
        strokeMiterlimit: 10,
        strokeWidth: 15,
      }}
    />
    <path
      d="m182.87 171.63-32-27.39A57.53 57.53 0 0 1 62.3 70.79"
      style={{
        stroke: "#99c379",
        fill: "none",
        strokeMiterlimit: 10,
        strokeWidth: 15,
      }}
    />
    <path
      d="M107.08 206.48c-2 0-3.89-.06-5.81-.17a99.57 99.57 0 0 1-90-72.42"
      style={{
        stroke: "#b27cb6",
        fill: "none",
        strokeMiterlimit: 10,
        strokeWidth: 15,
      }}
    />
  </svg>
);

export default SvgComponent;
