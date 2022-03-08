import { gql, useMutation } from "@apollo/client";
import { Button, Container, Box, Input, Text } from "@chakra-ui/react";
import Contract from "@components/datasources/Contract";
import { useState } from "react";

interface PreviewProps {
  data: any;
  func: any;
}

function Preview({ data, func }: PreviewProps) {
  let outputs;
  if (func.outputs.length > 1) {
    outputs = func.outputs.map((output: any, idx: number) => {
      return {
        ...output,
        result: data[idx],
      };
    });
  } else {
    outputs = [
      {
        ...func.outputs[0],
        result: data,
      },
    ];
  }
  return (
    <Container>
      <Text>
        <b>Preview</b>
      </Text>
      {outputs.map((o: any, idx: number) => {
        return (
          <Box
            borderWidth="1px"
            borderRadius="md"
            boxShadow="md"
            key={idx}
            margin={6}
            padding={6}
          >
            {o.type} {o.result.toString()}
          </Box>
        );
      })}
    </Container>
  );
}

const styles = {
  rounded: {
    fontFamily: '"Averia Sans Libre", cursive',
    borderRadius: "4px",
  },
};

export default Preview;
