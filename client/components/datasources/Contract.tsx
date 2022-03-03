import { gql, useMutation, useQuery } from "@apollo/client";
import { Button, Input, Select } from "@chakra-ui/react";
import { useState } from "react";
import { Datasource } from "types/project";

interface ContractProps {
  id: string;
  data: Datasource;
  update: (id: string, data: any) => void;
}

const CREATE_CONTRACT = gql`
  mutation CreateContract($address: String!) {
    createContract(address: $address) {
      id
      address
      functions
      events
      constructor
    }
  }
`;

function Contract({ id, data, update }: ContractProps) {
  const [address, setAddress] = useState<string>(data.contract!);
  const [createContract, other] = useMutation(CREATE_CONTRACT);

  const contractUpdate = async () => {
    await update(id, { ...data, contract: address });
    await createContract({ variables: { address: address } });
  };

  return (
    <>
      <Input
        type="text"
        placeholder="0x12345..."
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <Button onClick={contractUpdate}>Update</Button>
    </>
  );
}

export default Contract;
