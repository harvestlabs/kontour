import { gql } from "@apollo/client";
import GraphQLClient from "@gql/GraphQLClient";
import { web3 } from "./constants";

const AIRDROP = gql`
  mutation RequestAirdrop($key: String!, $projectId: String!) {
    requestAirdrop(key: $key, projectId: $projectId)
  }
`;

export default async function airdrop(projectId: string) {
  const accounts = await web3.eth.getAccounts();
  const resp = await GraphQLClient.mutate({
    mutation: AIRDROP,
    variables: {
      key: accounts[0],
      projectId: projectId,
    },
  });
  return resp;
}
