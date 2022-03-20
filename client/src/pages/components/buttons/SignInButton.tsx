import { gql, useQuery } from "@apollo/client";
import { Button, ButtonProps, Image } from "@chakra-ui/react";
import { CurrentUserQuery } from "@gql/__generated__/CurrentUserQuery";
import { setUserIdTo } from "@redux/slices/userSlice";
import { AuthContext } from "@utils/auth";
import { useContext, useEffect } from "react";
import * as Icons from "react-feather";
import { useDispatch } from "react-redux";
import colors from "src/theme/colors";

export const CURRENT_USER = gql`
  query CurrentUserQuery {
    currentUser {
      id
      profile {
        image_url
        github_handle
      }
    }
  }
`;

type props = {} & ButtonProps;
export default function SignInButton({ ...props }: props) {
  const { data, loading, error } = useQuery<CurrentUserQuery>(CURRENT_USER, {
    fetchPolicy: "network-only",
  });
  const dispatch = useDispatch();

  const user_id = data?.currentUser?.id;
  console.log("data", data);
  const github_handle = data?.currentUser?.profile?.github_handle;
  const image_url = data?.currentUser?.profile?.image_url;

  useEffect(() => {
    if (user_id) {
      dispatch(setUserIdTo(user_id));
    }
  }, [dispatch, user_id]);

  return (
    <Button
      size="lg"
      isLoading={loading}
      isDisabled={loading}
      variant="outline"
      colorScheme="contourBlue"
      onClick={async () => {
        window.location.assign(
          `${process.env.NEXT_PUBLIC_LINK_GITHUB_ENDPOINT}`
        );
      }}
      leftIcon={
        image_url ? (
          <Image
            height="28px"
            width="28px"
            borderRadius="14px"
            border={`2px solid ${colors.contourWhite}`}
            alt=""
            src={image_url}
          />
        ) : user_id ? (
          <Icons.User />
        ) : (
          <Icons.LogIn />
        )
      }
      {...props}
    >
      {loading
        ? "Loading..."
        : github_handle
        ? github_handle
        : user_id
        ? "anonymous"
        : "Sign in with Github"}
    </Button>
  );
}
