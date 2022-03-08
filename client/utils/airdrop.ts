import { gql } from "@apollo/client";
import GraphQLClient from "@gql/GraphQLClient";
import { web3 } from "./constants";

const AIRDROP = gql`
  mutation RequestAirdrop($key: String!) {
    requestAirdrop(key: $key)
  }
`;
const AIRDROP_MSG = "Airdrop Me!";

export default async function airdrop() {
  const accounts = await web3.eth.getAccounts();
  const resp = await GraphQLClient.mutate({
    mutation: AIRDROP,
    variables: {
      key: accounts[0],
    },
  });
  return resp;
}
