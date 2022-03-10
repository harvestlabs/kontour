import { gql, useMutation, useQuery } from "@apollo/client";
import { Button, Input, Select } from "@chakra-ui/react";
import { useState } from "react";

export interface WriteContractProps {
  address: string;
  params: any;
  func: any;
  onParamsUpdate: (params: any) => void;
  onFuncUpdate: (params: any) => void;
}

const CONTRACT = gql`
  query ContractWriteQuery($address: String!) {
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

export default function WriteContract({
  address,
  params,
  func,
  onParamsUpdate,
  onFuncUpdate,
}: WriteContractProps) {
  const {
    data: contractData,
    loading,
    error,
  } = useQuery(CONTRACT, {
    variables: { address: address },
  });
  const [myParams, setMyParams] = useState<any>(params);
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null);

  const functions = contractData ? contractData.contract?.functions : [];
  const writeFunctions = functions.filter(
    (f: any) => f.stateMutability !== "view"
  );
  const inputParams = selectedFunction
    ? functions.filter((f: any) => f.name === selectedFunction)[0].inputs
    : null;

  const setSingleParam = (name: string, value: string) => {
    const toSet = {
      ...myParams,
      [name]: value,
    };
    setMyParams(toSet);
    onParamsUpdate(toSet);
  };
  const wipeParams = () => {
    setMyParams({});
    onParamsUpdate({});
  };

  return (
    <>
      <div>
        <span>
          <b>Transactions</b>
        </span>
        <Select
          onChange={(e) => {
            setSelectedFunction(e.target.value);
            onFuncUpdate(e.target.value);
            wipeParams();
          }}
        >
          <option>Write to...</option>
          {writeFunctions.map((f: any, idx: number) => (
            <option key={idx}>{f.name}</option>
          ))}
        </Select>
      </div>
      {inputParams ? (
        <div>
          {inputParams.map((i: any, idx: number) => {
            return (
              <div key={idx}>
                <div>{i.name}</div>
                <Input
                  type="text"
                  placeholder={i.type}
                  onChange={(e) => setSingleParam(i.name, e.target.value)}
                />
              </div>
            );
          })}
        </div>
      ) : null}
    </>
  );
}
