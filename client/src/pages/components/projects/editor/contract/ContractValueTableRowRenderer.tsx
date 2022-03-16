import {
  Tr,
  Text,
  Td,
  Input,
  FormHelperText,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ContractValueInputRenderer from "./ContractValueInputRenderer";
import { SubmitHandler, useForm } from "react-hook-form";

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

  const {
    register,
    watch,
    trigger,
    setError,
    clearErrors,
    getValues,
    formState: { errors },
  } = useForm<any>();

  useEffect(() => {
    async function getRenderedValueWithInputs(inputs: any[]) {
      console.log("testing", errors, inputs);
      try {
        const a = await contract.methods[name](...inputs).call();
        setValueToRender(a);
        clearErrors();
      } catch (e: any) {
        setValueToRender("");
        setError("execute", { message: `${name}: ${e.message}` });
      }
    }
    const subscription = watch((value, { name, type }) => {
      if (inputs?.length && inputs?.length > 0) {
        const values = getValues();
        const inputValues = Object.keys(values)
          .map((key) => values[key])
          .filter((val) => val);
        if (inputValues.length === inputs.length) {
          getRenderedValueWithInputs(inputValues);
        } else {
          clearErrors();
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [
    clearErrors,
    contract.methods,
    errors,
    getValues,
    inputs,
    inputs?.length,
    name,
    setError,
    watch,
  ]);

  useEffect(() => {
    async function getRenderedValue() {
      try {
        const a = await contract.methods[name]().call();
        setValueToRender(a);
      } catch (e) {}
    }
    if (!inputs?.length) {
      getRenderedValue();
    }
  }, [contract.methods, inputs, name]);

  console.log("errors", errors?.execute?.message);
  return (
    <>
      <Tr key={name}>
        <Td>{name}:</Td>

        {errors?.execute ? (
          <Td>{errors?.execute?.message}</Td>
        ) : Array.isArray(valueToRender) ? (
          <Td>[{valueToRender.join(", ") || " "}]</Td>
        ) : (
          <Td>{valueToRender}</Td>
        )}
      </Tr>
      {inputs
        ? inputs.map((input, idx) => (
            <Tr key={input.name}>
              <Td>{input.name}</Td>
              <Td>
                <FormControl>
                  <ContractValueInputRenderer
                    name={idx.toString()}
                    register={register}
                    type={input.type}
                    trigger={trigger}
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
