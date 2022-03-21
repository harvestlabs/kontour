import React from "react";
import { Text, FormLabel, Button, Input, Box } from "@chakra-ui/react";
import { InstanceFragment_contracts } from "@gql/__generated__/InstanceFragment";
import { gql, useMutation, useQuery } from "@apollo/client";

const CREATE_MAINNET_VERSION = gql`
  mutation CreateMainnetVersion($projectVersionId: String!) {
    createMainnetVersion(projectVersionId: $projectVersionId) {
      id
    }
  }
`;

type Props = {
  projectVersionId: string;
};

export default function MainnetButton({ projectVersionId }: Props) {
  const [createMainnetVersion, { loading, error }] = useMutation(
    CREATE_MAINNET_VERSION
  );

  return (
    <Button
      size="lg"
      zIndex="10000"
      position="fixed"
      bottom="24px"
      right="24px"
      onClick={() => createMainnetVersion({ variables: { projectVersionId } })}
    >
      Publish Mainnet Version
    </Button>
  );
}
