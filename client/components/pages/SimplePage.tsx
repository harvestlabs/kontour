import { gql, useMutation } from "@apollo/client";
import { Button, Input } from "@chakra-ui/react";
import Contract from "@components/datasources/Contract";
import { useState } from "react";
import { Page } from "types/project";

interface PageProps {
  data: Page;
}

function Page({ data }: PageProps) {
  return <>{JSON.stringify(data)}</>;
}

export default Page;
