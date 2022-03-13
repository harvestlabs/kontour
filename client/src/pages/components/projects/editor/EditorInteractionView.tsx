import React, { constructor, useEffect, useState } from "react";
import {
  Text,
  Accordion,
  Box,
  Flex,
  Heading,
  Button,
  List,
  ListIcon,
  ListItem,
} from "@chakra-ui/react";
import { selectSelectedContractData } from "@redux/slices/projectSlice";
import { useAppSelector } from "@redux/hooks";
import EditorPublishButton from "./EditorPublishButton";
import { gql } from "@apollo/client";
import { functions } from "lodash";
import * as Icons from "react-feather";
import { EditorInteractionViewFragment } from "@gql/__generated__/EditorInteractionViewFragment";
import Web3 from "web3";

type Props = {};

export default function EditorInteractionView({}: Props) {
  const contract_source = useAppSelector(selectSelectedContractData);

  const [contract, setContract] = useState<any>(null);

  let { functions, constructor, events, abi } =
    (contract_source as {
      functions: ContractSourceFunction[];
      constructor: ContractSourceConstructor;
      events: ContractSourceEvent[];
    }) || {};

  // const abi = abi;

  useEffect(() => {
    async function helper() {
      if (abi) {
        // const result = contract.methods
        //   .set(1000000000)
        //   .send({
        //     from: account,
        //   })
        //   .then(function (receipt) {
        //     resolve(receipt);
        //   })
        //   .on("error", function (error, receipt) {
        //     reject(error, receipt);
        //   });
      }
    }
    console.log("abi", abi);
    helper();
  }, [abi, contract]);

  return contract_source != null ? (
    <Flex width="100%" height="100%" flexDirection="column" overflow="scroll">
      <Heading>{contract_source.name}</Heading>
      <EditorPublishButton />
      <Button
        onClick={async () => {
          alert("This does nothing right now");
        }}
      >
        Request Account
      </Button>
      <Button
        onClick={async () => {
          const json = JSON.parse(JSON.stringify(abi));
          //@ts-ignore
          const kontour = window.kontour;
          kontour.setupContract(
            json,
            "0xbB3E54f2456885EB1af717db2a4ED0D3A4d7942E"
          );
          // let a = await kontour.get();
          // console.log(a);
          const a = await kontour.get();
          console.log("testing get", a);

          alert(a);
        }}
      >
        Test Get
      </Button>
      <Button
        onClick={async () => {
          const json = JSON.parse(JSON.stringify(abi));
          //@ts-ignore
          const kontour = window.kontour;
          kontour.setupContract(
            json,
            "0xbB3E54f2456885EB1af717db2a4ED0D3A4d7942E"
          );
          // let a = await kontour.get();
          // console.log(a);

          const a = await kontour.set(Math.floor(Math.random() * 100));
          // console.log("testing get", a);

          // alert(a);
        }}
      >
        Test set
      </Button>
      <Button
        onClick={async () => {
          const val = await contract.methods.get().call();
          alert(val);
        }}
      >
        test
      </Button>
    </Flex>
  ) : null;
}

EditorInteractionView.fragments = {
  contract: gql`
    fragment EditorInteractionViewFragment on ContractSource {
      id
      name
      constructor
      events
      functions
      abi
    }
  `,
};
