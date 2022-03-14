import { gql, useMutation } from "@apollo/client";
import { Button } from "@chakra-ui/react";

const REQUEST_API_KEY = gql`
  mutation RequestApiKey {
    requestApiKey
  }
`;

interface RequestApiKeyButtonProps {
  onComplete: (id: string) => void;
}

function RequestApiKeyButton({ onComplete }: RequestApiKeyButtonProps) {
  const [requestApiKey, { loading, error }] = useMutation(REQUEST_API_KEY);
  return (
    <Button
      onClick={async () => {
        const resp = await requestApiKey();
        onComplete(resp.data?.requestApiKey);
      }}
    >
      Request Key
    </Button>
  );
}

export default RequestApiKeyButton;
