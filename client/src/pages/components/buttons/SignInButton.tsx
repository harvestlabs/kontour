import { Button } from "@chakra-ui/react";
import * as Icons from "react-feather";

export default function SignInButton() {
  return (
    <Button
      size="lg"
      onClick={async () => {
        // log in here
      }}
      leftIcon={<Icons.User />}
    >
      Sign in
    </Button>
  );
}
