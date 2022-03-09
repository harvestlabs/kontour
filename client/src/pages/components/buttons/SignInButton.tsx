import { Button } from "@chakra-ui/react";
import * as Icons from "react-feather";

export default function SignInButton() {
  return (
    <Button
      size="lg"
      onClick={async () => {
        window.location.assign(
          `${process.env.NEXT_PUBLIC_LINK_TWITTER_ENDPOINT}`
        );
      }}
      leftIcon={<Icons.User />}
    >
      Sign in with Twitter
    </Button>
  );
}
