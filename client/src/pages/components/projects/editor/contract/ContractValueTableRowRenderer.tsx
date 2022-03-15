import { Tr, Td, Input, FormHelperText, FormControl } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ContractValueInputRenderer from "./ContractValueInputRenderer";

export type ContractFunctionInputType = {
  name: string;
  type: string;
};

export type ContractFunctionValueType = {
  name: string;
  inputs?: ContractFunctionInputType[];
};

type Props = {
  name: string;
  inputs?: ContractFunctionInputType[];
  contract: any;
};

export default function ContractValueTableRowRenderer({
  name,
  contract,
  inputs,
}: Props) {
  const [valueToRender, setValueToRender] = useState<any>(null);
  const [inputValues, setInputValues] = useState<any[]>([]);

  console.log("jjj", name, inputs);
  useEffect(() => {
    async function getRenderedValue(inputs: any[]) {
      const a = await contract.methods[name](...inputs).call();
      setValueToRender(a);
    }
    if ((inputs?.length || 0) === inputValues.length) {
      getRenderedValue(inputValues);
    }
  }, [contract.methods, inputValues, inputs, name]);

  return (
    <>
      <Tr key={name}>
        <Td>{name}:</Td>
        {Array.isArray(valueToRender) ? (
          <Td>[{valueToRender.join(", ") || " "}]</Td>
        ) : (
          <Td>{valueToRender}</Td>
        )}
      </Tr>

      {inputs
        ? inputs.map((input) => (
            <Tr key={input.name}>
              <Td>{input.name}</Td>
              <Td>
                <FormControl>
                  <ContractValueInputRenderer
                    type={input.type}
                    onChange={() => {}}
                  />
                  <FormHelperText m="0">{input.type}</FormHelperText>
                </FormControl>
              </Td>
            </Tr>
          ))
        : null}
    </>
  );
}
