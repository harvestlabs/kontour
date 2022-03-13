import { gql } from "@apollo/client";
import GraphQLClient from "@gql/GraphQLClient";

const AIRDROP = gql`
  mutation RequestAirdrop($key: String!, $nodeId: String!) {
    requestAirdrop(key: $key, nodeId: $nodeId)
  }
`;

export default async function airdrop(nodeId: string) {
  const resp = await GraphQLClient.mutate({
    mutation: AIRDROP,
    variables: {
      // @ts-ignore
      key: await window.kontour.getAccount(),
      nodeId: nodeId,
    },
  });
  return resp;
}
