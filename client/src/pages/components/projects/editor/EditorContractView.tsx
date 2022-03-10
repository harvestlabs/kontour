import React from "react";
import { Text, Accordion, Box, Flex, Heading } from "@chakra-ui/react";
import { selectSelectedContractData } from "@redux/slices/projectSlice";
import { useAppSelector } from "@redux/hooks";
import EditorPublishButton from "./EditorPublishButton";

type Props = {};

export default function EditorContractView({
  children,
}: React.PropsWithChildren<Props>) {
  const contract = useAppSelector(selectSelectedContractData);
  console.log("acontr", contract);
  return (
    <Flex width="100%" height="100%" flexDirection="column">
      <Heading>{contract.name}</Heading>
      {contract.methods.map((method: string) => {
        return <Text key={method}>{method}</Text>;
      })}
      <EditorPublishButton />
    </Flex>
  );
}
