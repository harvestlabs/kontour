import { gql } from "@apollo/client";
import GraphQLClient from "@gql/GraphQLClient";
import { web3 } from "./constants";

const AIRDROP = gql`
  mutation RequestAirdrop($key: String!, $nodeId: String!) {
    requestAirdrop(key: $key, nodeId: $nodeId)
  }
`;

export default async function airdrop(nodeId: string) {
  const accounts = await web3.eth.getAccounts();
  const resp = await GraphQLClient.mutate({
    mutation: AIRDROP,
    variables: {
      key: accounts[0],
      nodeId: nodeId,
    },
  });
  return resp;
}
