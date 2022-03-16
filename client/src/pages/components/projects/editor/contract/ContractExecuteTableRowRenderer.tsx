import {
  Tr,
  Text,
  Td,
  Input,
  FormHelperText,
  FormControl,
  FormErrorMessage,
  Button,
  Box,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import ContractValueInputRenderer from "./ContractValueInputRenderer";
import { SubmitHandler, useForm } from "react-hook-form";
import { ContractFunctionInputType } from "./ContractValueTableRowRenderer";
import * as Icons from "react-feather";

type Props = {
  name: string;
  inputs?: ContractFunctionInputType[];
  contract: any;
  payable?: boolean;
};

export default function ContractExecuteTableRowRenderer({
  name,
  contract,
  inputs = [],
  payable = false,
}: Props) {
  const {
    register,
    trigger,
    setError,
    clearErrors,
    getValues,
    formState: { errors },
  } = useForm<any>();
  const [value, setValue] = useState("");

  // @ts-ignore
  const kontour = window.kontour;

  const executeFunction = useCallback(async () => {
    try {
      console.log("values", getValues());
      const values = getValues();
      const inputValues = Object.keys(values)
        .map((key) => values[key])
        .filter((val) => val);

      if (inputValues.length === inputs.length) {
        const transaction = contract.methods[name](...inputValues);
        const account = kontour.getAccount();
        const data: { from: any; value?: string } = { from: account };
        if (payable) {
          data.value = kontour.web3.utils.toWei(value);
        }
        const gas = await transaction.estimateGas(data);
        const tx = await transaction.send({
          gas,
          ...data,
        });
        clearErrors();
      } else {
        setError("execute", { message: `Not enough inputs.` });
      }
    } catch (e: any) {
      console.log("error", e);
      setError("execute", { message: `${name}: ${e.message}` });
    }
  }, [
    clearErrors,
    contract.methods,
    getValues,
    inputs.length,
    kontour,
    name,
    payable,
    setError,
    value,
  ]);
  console.log(errors);

  return (
    <>
      <Tr key={name}>
        <Td>
          <b>{name}:</b>
        </Td>
        <Td>
          <FormControl isInvalid={errors?.execute} display="flex">
            <Flex>
              <IconButton
                aria-label="execute"
                size="sm"
                mr="12px"
                icon={<Icons.Play size="12" fill="black" />}
                onClick={() => {
                  executeFunction();
                }}
              />
              {payable ? (
                <Box mr="12px">
                  <Input
                    size="sm"
                    value={value}
                    onChange={(e) => {
                      setValue(e.target.value);
                    }}
                  />
                  <FormHelperText m="0">payment (eth)</FormHelperText>
                  <FormErrorMessage>
                    {errors?.execute?.message}
                  </FormErrorMessage>
                </Box>
              ) : null}
            </Flex>
            {!payable && (
              <FormErrorMessage>{errors?.execute?.message}</FormErrorMessage>
            )}
          </FormControl>
        </Td>
      </Tr>
      {inputs
        ? inputs.map((input, idx) => (
            <Tr key={input.name}>
              <Td>
                {input.name}: {input.type}
              </Td>
              <Td>
                <ContractValueInputRenderer
                  name={idx.toString()}
                  register={register}
                  type={input.type}
                  trigger={trigger}
                />
              </Td>
            </Tr>
          ))
        : null}
    </>
  );
}
