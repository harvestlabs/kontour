import { gql, useQuery } from "@apollo/client";
import { Button } from "@chakra-ui/react";
import { CurrentUserQuery } from "@gql/__generated__/CurrentUserQuery";
import { setUserIdTo } from "@redux/slices/userSlice";
import { AuthContext } from "@utils/auth";
import { useContext, useEffect } from "react";
import * as Icons from "react-feather";

export const CURRENT_USER = gql`
  query CurrentUserQuery {
    currentUser {
      id
    }
  }
`;

export default function SignInButton() {
  const { data, loading, error } = useQuery<CurrentUserQuery>(CURRENT_USER, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (data?.currentUser) {
      setUserIdTo(data.currentUser.id);
    }
  }, [data]);

  const user_id = data?.currentUser?.id;

  return (
    <Button
      size="lg"
      isLoading={loading}
      isDisabled={loading}
      onClick={async () => {
        window.location.assign(
          `${process.env.NEXT_PUBLIC_LINK_TWITTER_ENDPOINT}`
        );
      }}
      leftIcon={<Icons.User />}
    >
      {loading ? "Loading..." : user_id ? user_id : "Sign in with Twitter"}
    </Button>
  );
}
