import { gql, useMutation } from "@apollo/client";
import { Button, Text, Heading, HStack, VStack } from "@chakra-ui/react";
import { useState } from "react";
import RequestApiKeyButton from "./RequestAPIKeyButton";

interface RequestApiKeyProps {}

function RequestApiKey({ onComplete }: RequestApiKeyProps) {
  const [key, setKey] = useState<string | null>(null);
  return (
    <VStack>
      <Heading>Request an Alpha Key</Heading>
      <RequestApiKeyButton
        onComplete={(key) => {
          setKey(key);
        }}
      />
      {key != null && (
        <HStack>
          <Text>Your Key:</Text>
          <Text>{key}</Text>
        </HStack>
      )}
    </VStack>
  );
}

export default RequestApiKey;
