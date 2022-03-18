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
      cx={116.13}
      cy={107}
      r={25}
      style={{
        fill: "#dfddef",
      }}
    />
    <path
      d="M41.73 41a99.48 99.48 0 0 1 148.8 0l-29.62 29.79"
      style={{
        stroke: "#69addf",
        fill: "none",
        strokeMiterlimit: 10,
        strokeWidth: 15,
      }}
    />
    <path
      d="m192 171.63-32-27.39a57.53 57.53 0 0 1-88.58-73.45"
      style={{
        stroke: "#99c379",
        fill: "none",
        strokeMiterlimit: 10,
        strokeWidth: 15,
      }}
    />
    <path
      d="M116.2 206.48c-1.94 0-3.88-.06-5.8-.17a99.57 99.57 0 0 1-90-72.42"
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
