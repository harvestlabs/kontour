import { Input } from "@chakra-ui/react";
import { UseFormRegister, UseFormTrigger } from "react-hook-form";

type Props = {
  type: string;
  name: string;
  register: UseFormRegister<any>;
  trigger: UseFormTrigger<any>;
};

const ContractValueTypes = "address";

export default function ContractValueInputRenderer({
  name,
  type,
  register,
  trigger,
}: Props) {
  switch (type) {
    case "address":
    default:
      return (
        <Input
          size="sm"
          {...register(name, {
            onChange: (e) => {
              trigger(name);
            },
          })}
        />
      );
  }
}
