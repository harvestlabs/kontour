import { Input } from "@chakra-ui/react";

type Props = { type: string; onChanged: (value: any) => void };

const ContractValueTypes = "address";

export default function ContractValueInputRenderer({ type, onChanged }: Props) {
  switch (type) {
    case "address":
    default:
      return (
        <Input
          onChange={(e) => {
            onChanged(e.target.value);
          }}
        />
      );
  }
}
