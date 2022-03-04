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
  mutation CreateContract($address: String!, $chainId: Int!) {
    createContract(address: $address, chainId: $chainId) {
      id
      address
      functions
      events
      constructor
    }
  }
`;
const CREATE_FROM_TEMPLATE = gql`
  mutation CreateFromTemplate($chainId: Int!) {
    createFromTemplate(chainId: $chainId) {
      id
      address
      functions
      events
      constructor
    }
  }
`;

function Contract({ id, data, update }: ContractProps) {
  const [address, setAddress] = useState<string>(data.address!);
  const [chainId, setChainId] = useState<number>(data.chainId!);
  const [createContract, other] = useMutation(CREATE_CONTRACT);
  const [createFromTemplate, _other] = useMutation(CREATE_FROM_TEMPLATE);

  const contractUpdate = async () => {
    await update(id, { ...data, address: address, chainId: chainId });
    await createContract({ variables: { address: address, chainId: chainId } });
  };

  const newContract = async () => {
    const resp = await createFromTemplate({ variables: { chainId: chainId } });
    await update(id, {
      ...data,
      address: resp.data?.createFromTemplate.address,
      chainId: chainId,
    });
  };

  return (
    <>
      <Input
        type="text"
        placeholder="0x12345..."
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <Input
        type="number"
        placeholder="1"
        value={chainId}
        onChange={(e) => setChainId(Number(e.target.value))}
      />
      <Button onClick={contractUpdate}>Update</Button>
      <Button onClick={newContract}>Deploy Template</Button>
    </>
  );
}

export default Contract;
