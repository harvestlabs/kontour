import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import {
  Button,
  Input,
  Text,
  Select,
  Container,
  Box,
  HStack,
} from "@chakra-ui/react";
import WriteContract from "@components/datasources/WriteContract";
import { CONTRACT_ABI } from "@components/displays/SimpleContainer";
import GraphQLClient from "@gql/GraphQLClient";
import { useAppSelector, useAppDispatch } from "@redux/hooks";
import {
  reset,
  setData,
  mergeData,
  selectDatasources,
} from "@redux/slices/projectSlice";
import {
  contractFromABI,
  findABIFunction,
  serializeParams,
} from "@utils/contracts";
import { web3 } from "@utils/constants";
import { Interaction } from "types/project";

interface InteractionProps {
  id: string;
  data: Interaction;
  update: (id: string, data: any) => void;
  updatePage: (data: string[]) => void;
}

function SimpleInteraction({ id, data, update, updatePage }: InteractionProps) {
  const datasources = useAppSelector(selectDatasources) || [];
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState<string | null>(data.datasource);
  const [params, setParams] = useState<any>(data.params);
  const [funcName, setFuncName] = useState<any>(data.func);
  const [result, setResult] = useState<any>(null);
  const [title, setTitle] = useState<string>("Try me");
  const [abiFunc, setAbiFunc] = useState<any>(null);

  const saveButton = async () => {
    await update(id, {
      ...data,
      datasource: selected,
      params: params,
      func: funcName,
      title: title,
    });
  };
  const previewButton = async () => {
    const datasource = datasources[selected!];
    if (datasource.type === "CONTRACT") {
      const address = datasource.address!;
      const resp = await GraphQLClient.query({
        query: CONTRACT_ABI,
        variables: {
          address: address,
        },
      });
      const accounts = await web3.eth.getAccounts();
      const abiFunction = findABIFunction(resp.data.contract.abi, funcName);
      setAbiFunc(abiFunction);

      const contract = contractFromABI([{ ...abiFunction }], address);
      const callParams = await serializeParams(params, abiFunction.inputs);
      console.log("params", callParams);
      const transactionParameters = {
        to: address,
        from: accounts[0],
        data: contract.methods[abiFunction.name](...callParams).encodeABI(),
      };
      try {
        const result = await contract.methods[abiFunction.name](
          ...callParams
        ).send({
          from: accounts[0],
          gas: await web3.eth.estimateGas(transactionParameters),
          gasPrice: await web3.eth.getGasPrice(),
        });
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
        <>
          <WriteContract
            address={datasources[selected].address!}
            params={params}
            func={funcName}
            onParamsUpdate={setParams}
            onFuncUpdate={setFuncName}
          />
          <Input
            type="text"
            placeholder="Name your button"
            onChange={(e) => setTitle(e.target.value)}
          />
          <HStack>
            <Button onClick={saveButton}>Save changes</Button>
            <Button onClick={() => updatePage([id])}>Add to Page</Button>
          </HStack>
          <Container>
            <Text>
              <b>Preview</b>
            </Text>
            <Box
              borderWidth="1px"
              borderRadius="md"
              boxShadow="md"
              margin={6}
              padding={6}
              cursor="pointer"
              textAlign="center"
              onClick={previewButton}
            >
              <b>{title}</b>
            </Box>
          </Container>
        </>
      ) : null}
      {result !== null ? (
        <Text>
          <b>Results {result}</b>
        </Text>
      ) : null}
    </>
  );
}

export default SimpleInteraction;
