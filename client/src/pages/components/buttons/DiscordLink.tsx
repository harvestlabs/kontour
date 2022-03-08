import { Link, Button, ButtonProps, LinkProps } from "@chakra-ui/react";
import NextLink from "next/link";
import DiscordLogo, { DiscordLogoProps } from "@components/logo/DiscordLogo";
import { MouseEvent } from "react";

type Props = {
  button?: boolean;
  onClick?: (e: MouseEvent) => void;
  size: number;
} & any;
export default function DiscordLink({
  button = false,
  onClick,
  ...props
}: Props) {
  return button ? (
    <Button
      mr="12px"
      aria-label="Reject Bounty"
      bg="#5865F2"
      onClick={(e) => {
        window.open("https://discord.gg/rFghjfWMKY", "_blank");
        onClick && onClick(e);
      }}
      {...props}
    >
      <DiscordLogo {...props} />
    </Button>
  ) : (
    <NextLink href="https://discord.gg/rFghjfWMKY" passHref>
      <Link
        onClick={(e) => {
          onClick && onClick(e);
        }}
        target="_blank"
        {...props}
      >
        <DiscordLogo {...props} />
      </Link>
    </NextLink>
  );
}
