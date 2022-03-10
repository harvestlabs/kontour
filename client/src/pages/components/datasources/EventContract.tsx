import { gql, useMutation, useQuery } from "@apollo/client";
import { Button, Input, Select } from "@chakra-ui/react";
import { useState } from "react";

export interface EventContractProps {
  address: string;
}

const CONTRACT = gql`
  query ContractQuery($address: String!) {
    contract(address: $address) {
      id
      address
      contractSource {
        name
        source
        abi
        chain_id
        functions
        events
        constructor
      }
      node
    }
  }
`;

export default function EventContract({ address }: EventContractProps) {
  const {
    data: contractData,
    loading,
    error,
  } = useQuery(CONTRACT, {
    variables: { address: address },
  });
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null);

  const events = contractData ? contractData.contract?.events : [];

  return (
    <>
      <div>
        <span>
          <b>Events</b>
        </span>
        <Select>
          <option>Listen to...</option>
          {events.map((f: any, idx: number) => (
            <option key={idx}>{f.name}</option>
          ))}
        </Select>
      </div>
    </>
  );
}
