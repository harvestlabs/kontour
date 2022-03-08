import { gql, useMutation, useQuery } from "@apollo/client";
import { Button, Input, Select } from "@chakra-ui/react";
import { useState } from "react";

export interface ReadContractProps {
  address: string;
  params: any;
  func: any;
  onParamsUpdate: (params: any) => void;
  onFuncUpdate: (params: any) => void;
}

export const CONTRACT = gql`
  query Contract($address: String!) {
    contract(address: $address) {
      id
      address
      functions
      events
      constructor
    }
  }
`;

export default function ReadContract({
  address,
  params,
  func,
  onParamsUpdate,
  onFuncUpdate,
}: ReadContractProps) {
  const {
    data: contractData,
    loading,
    error,
  } = useQuery(CONTRACT, {
    variables: { address: address },
  });
  const [myParams, setMyParams] = useState<any>(params);
  const [selectedFunction, setSelectedFunction] = useState<any>(null);

  const functions = contractData ? contractData.contract?.functions : [];
  const readFunctions = functions.filter(
    (f: any) => f.stateMutability === "view"
  );
  const inputParams = selectedFunction
    ? readFunctions.filter((f: any) => f.name === selectedFunction)[0].inputs
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
          <b>Getters</b>
        </span>
        <Select
          onChange={(e) => {
            setSelectedFunction(e.target.value);
            onFuncUpdate(e.target.value);
            wipeParams();
          }}
        >
          <option>Read from...</option>
          {readFunctions.map((f: any, idx: number) => (
            <option key={idx} value={f.name}>
              {f.name}
            </option>
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
