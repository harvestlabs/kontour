import { gql, useMutation } from "@apollo/client";
import { Button, HStack, Input, Select } from "@chakra-ui/react";
import ReadContract, { CONTRACT } from "@components/datasources/ReadContract";
import { useAppSelector, useAppDispatch } from "@redux/hooks";
import {
  reset,
  setData,
  mergeData,
  selectPage,
  selectDatasources,
} from "@redux/slices/projectSlice";
import { web3 } from "@utils/constants";
import { useState } from "react";
import GraphQLClient from "@gql/GraphQLClient";
import {
  serializeParams,
  contractFromABI,
  findABIFunction,
} from "@utils/contracts";
import Preview from "./Preview";
import { Display } from "types/project";

interface ContainerProps {
  id: string;
  data: Display;
  update: (id: string, data: any) => void;
  updatePage: (data: string[]) => void;
}

export const CONTRACT_ABI = gql`
  query Contract($address: String!) {
    contract(address: $address) {
      id
      address
      abi
    }
  }
`;

function SimpleContainer({ id, data, update, updatePage }: ContainerProps) {
  const datasources = useAppSelector(selectDatasources) || [];
  const page = useAppSelector(selectPage) || [];
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState<string | null>(data.datasource);
  const [params, setParams] = useState<any>(data.params);
  const [funcName, setFuncName] = useState<any>(data.func);
  const [result, setResult] = useState<any>(null);
  const [abiFunc, setAbiFunc] = useState<any>(null);

  console.log("container data", data);
  const saveAndPreview = async () => {
    await update(id, {
      ...data,
      datasource: selected,
      params: params,
      func: funcName,
    });
    const datasource = datasources[selected!];
    if (datasource.type === "CONTRACT") {
      const address = datasource.address!;
      const resp = await GraphQLClient.query({
        query: CONTRACT_ABI,
        variables: {
          address: address,
        },
      });
      console.log("data", resp.data);
      const abiFunction = findABIFunction(resp.data.contract.abi, funcName);
      setAbiFunc(abiFunction);
      const contract = contractFromABI([{ ...abiFunction }], address);
      console.log("contract", contract);
      const callParams = await serializeParams(params, abiFunction.inputs);
      console.log("params", callParams);
      try {
        const result = await contract.methods[abiFunction.name](
          ...callParams
        ).call();
        console.log("result", result);
        setResult(result);
      } catch (e: unknown) {
        console.error("Something went wrong:");
        console.error(e);
      }
    }
  };

  return (
    <>
      <Select onChange={(e) => setSelected(e.target.value)}>
        <option>Select a datasource...</option>
        {Object.keys(datasources).map((id) => {
          return (
            <option key={id} value={id}>
              {datasources[id].address}
            </option>
          );
        })}
      </Select>
      {selected ? (
        <ReadContract
          address={datasources[selected].address!}
          params={params}
          func={funcName}
          onParamsUpdate={setParams}
          onFuncUpdate={setFuncName}
        />
      ) : null}
      <HStack>
        <Button onClick={() => saveAndPreview()}>Save and preview</Button>
        <Button onClick={() => updatePage([id])}>Add to Page</Button>
      </HStack>
      {result != null ? <Preview data={result} func={abiFunc} /> : null}
    </>
  );
}

export default SimpleContainer;
