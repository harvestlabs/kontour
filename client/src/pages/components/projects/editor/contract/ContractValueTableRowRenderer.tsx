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
import { KONTOUR_REFRESH_CONTRACT } from "@utils/constants";

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
    async function getRenderedValueWithInputs(
      inputs: ContractFunctionInputType[]
    ) {
      try {
        const a = await contract.methods[name](...inputs).call();
        setValueToRender(a);
        clearErrors();
      } catch (e: any) {
        setValueToRender("");
        setError("execute", { message: `${name}: ${e.message}` });
      }
    }

    function fetchNewValue(inputs: ContractFunctionInputType[] = []) {
      console.log("calling fetch");
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
      } else {
        getRenderedValueWithInputs(inputs);
      }
    }

    function autoRefresh() {
      fetchNewValue(inputs);
    }
    document.addEventListener(KONTOUR_REFRESH_CONTRACT, autoRefresh);
    let unsubscribers: (() => void)[] = [
      () => {
        document.removeEventListener(KONTOUR_REFRESH_CONTRACT, autoRefresh);
      },
    ];

    if (!inputs?.length) {
      fetchNewValue(inputs);
    } else {
      const subscription = watch((value, { name, type }) => {
        fetchNewValue(inputs);
      });
      unsubscribers.push(() => subscription.unsubscribe());
    }
    return () => {
      unsubscribers.map((unsubscriber) => unsubscriber());
    };
  }, [
    clearErrors,
    contract.methods,
    getValues,
    inputs,
    inputs?.length,
    name,
    setError,
    watch,
  ]);

  return (
    <>
      <Tr key={name}>
        <Td>
          <Text variant="code" layerStyle="function2" as="b">
            {name}
          </Text>
        </Td>

        {errors?.execute ? (
          <Td>
            <Text variant="code" layerStyle="error">
              {errors?.execute?.message}
            </Text>
          </Td>
        ) : Array.isArray(valueToRender) ? (
          <Td>
            [{" "}
            {valueToRender.map((value, idx) => {
              return (
                <Text variant="code" as="span" key={idx}>
                  <Text as="span" layerStyle="value2">
                    {value}
                  </Text>
                  {idx !== valueToRender.length - 1 ? ", " : null}
                </Text>
              );
            }) || " "}{" "}
            ]
          </Td>
        ) : (
          <Td>
            <Text variant="code" layerStyle="value2">
              {valueToRender}
            </Text>
          </Td>
        )}
      </Tr>
      {inputs
        ? inputs.map((input, idx) => (
            <Tr key={idx}>
              <Td pl="40px">
                {input.name} :{" "}
                <Text as="span" layerStyle="type2">
                  {" "}
                  {input.type}
                </Text>
              </Td>
              <Td>
                <FormControl>
                  <ContractValueInputRenderer
                    name={idx.toString()}
                    register={register}
                    type={input.type}
                    trigger={trigger}
                  />
                </FormControl>
              </Td>
            </Tr>
          ))
        : null}
    </>
  );
}
