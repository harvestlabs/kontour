import { gql, useMutation, useQuery } from "@apollo/client";
import { Button, Input, Select } from "@chakra-ui/react";
import { useAppSelector } from "@redux/hooks";
import { selectId } from "@redux/slices/projectSlice";
import { useState } from "react";
import { Datasource } from "types/project";

interface ContractProps {
  id: string;
  data: Datasource;
  update: (id: string, data: any) => void;
}

const IMPORT_CONTRACT = gql`
  mutation ImportContract($address: String!, $chainId: Int!, $userId: String!) {
    importContract(address: $address, chainId: $chainId, userId: $userId) {
      name
      source
      abi
      chain_id
      functions
      events
      constructor
    }
  }
`;
const CREATE_FROM_TEMPLATE = gql`
  mutation CreateFromTemplate(
    $userId: String!
    $template: Template!
    $params: JSONObject!
  ) {
    createFromTemplate(userId: $userId, template: $template, params: $params) {
      name
      source
      abi
      chain_id
      functions
      events
      constructor
    }
  }
`;

function Contract({ id, data, update }: ContractProps) {
  const projectId = useAppSelector(selectId);
  const [address, setAddress] = useState<string>(data.address!);
  const [chainId, setChainId] = useState<number>(data.chainId!);
  const [importContract, other] = useMutation(IMPORT_CONTRACT);
  const [createFromTemplate, _other] = useMutation(CREATE_FROM_TEMPLATE);

  const contractUpdate = async () => {
    await update(id, { ...data, address: address, chainId: chainId });
    await importContract({ variables: { address: address, chainId: chainId } });
  };

  const newContract = async () => {
    const resp = await createFromTemplate({
      variables: {
        projectId: projectId,
        template: "STORAGE",
        params: {
          variables: [
            { type: "PRIMITIVE", name: "thing", data: { valueType: "uint8" } },
          ],
        },
      },
    });
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
