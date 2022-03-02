import { gql, useMutation } from "@apollo/client";
import { Button, Input } from "@chakra-ui/react";
import Contract from "@components/datasources/Contract";
import { useState } from "react";

interface DatasourceProps {
  id: string;
  data: any;
  update: (id: string, data: any) => void;
}

function Datasource({ id, data, update }: DatasourceProps) {
  return (
    <>
      {data.type === "CONTRACT" ? (
        <Contract id={id} data={data} update={update} />
      ) : null}
    </>
  );
}

export default Datasource;
