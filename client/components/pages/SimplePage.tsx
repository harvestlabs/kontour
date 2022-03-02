import { gql, useMutation } from "@apollo/client";
import { Button, Input } from "@chakra-ui/react";
import Contract from "@components/datasources/Contract";
import { useState } from "react";

interface PageProps {
  data: any;
}

function Page({ data }: PageProps) {
  return <>{JSON.stringify(data)}</>;
}

export default Page;
