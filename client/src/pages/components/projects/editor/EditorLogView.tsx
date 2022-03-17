import { gql } from "@apollo/client";
import {
  Box,
  Text,
  Heading,
  Table,
  TableCaption,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  Flex,
} from "@chakra-ui/react";
import { EditorLogViewInstanceFragment } from "@gql/__generated__/EditorLogViewInstanceFragment";
import { parseEventReturnValues } from "@utils/event_parser";
import { useEffect, useState } from "react";

type Props = { instance: EditorLogViewInstanceFragment };

type SubTableProps = { data: Record<string, any>; indents: number };

function isObject(variable: any) {
  return typeof variable === "object" && variable !== null;
}

function SubTable({ data, indents }: SubTableProps) {
  const indentMultiplier = 32;
  return (
    <>
      {Object.keys(data).map((key) => {
        if (key === "_kontour") return null;
        return (
          <>
            <Tr>
              <Td pl={`${16 + indentMultiplier * indents}px`}>
                {indents > 0 && <>&rarr; </>}
                {key}
              </Td>
              {!isObject(data[key]) ? <Td>{data[key]}</Td> : null}
            </Tr>
            {isObject(data[key]) ? (
              <SubTable data={data[key]} indents={indents + 1} />
            ) : null}
          </>
        );
      })}
    </>
  );
}

function EditorLogView({ instance }: Props) {
  const [allEvents, setAllEvents] = useState<any[]>([]);
  useEffect(() => {
    // @ts-ignore
    const kontour = window.kontour;

    async function findContractEvents() {
      let allContractEvents: any[] = [];
      const listeners = [];

      await Promise.all(
        instance.contracts.map(async (contract) => {
          const abiJson = JSON.parse(
            JSON.stringify(contract.contractSource.abi)
          );
          const contractInstance = new kontour.web3.eth.Contract(
            abiJson,
            contract.address
          );

          // add a subscriber for each contract instance
          listeners.push(
            contractInstance.events.allEvents({}, (err: any, e: any) => {
              if (e && err == null) {
                const newAllEvents = [
                  {
                    ...e,
                    returnValues: parseEventReturnValues(e, abiJson),
                    _kontour: {
                      name: contract.contractSource.name,
                    },
                  },
                  ...allEvents,
                ];
                setAllEvents(newAllEvents);
              }
            })
          );

          const events = await contractInstance.getPastEvents("allEvents", {
            fromBlock: 0,
          });

          const eventsWithContractMetadata = events.map((evt: any) => {
            evt._kontour = { name: contract.contractSource.name };
            return {
              ...evt,
              returnValues: parseEventReturnValues(evt, abiJson),
              _kontour: {
                name: contract.contractSource.name,
              },
            };
          });
          allContractEvents = allContractEvents.concat(
            eventsWithContractMetadata
          );
        })
      );

      // reverse sort by block number
      allContractEvents.sort((a, b) => {
        if (a.blockNumber > b.blockNumber) {
          return -1;
        } else if (a.blockNumber < b.blockNumber) {
          return 1;
        } else return 0;
      });
      console.log("setitng");

      setAllEvents(allContractEvents);
    }

    findContractEvents();
  }, [instance.contracts]);

  useEffect(() => {}, []);

  console.log("vets", allEvents);
  return (
    <Flex
      width="100%"
      height="100%"
      flexDirection="column"
      overflow="scroll"
      position="relative"
    >
      {allEvents.map((evt) => {
        console.log("evt", evt);
        return (
          <Box key={evt.blockHash}>
            <Table variant="simple" size="sm">
              <TableCaption fontSize="16px" textAlign="left" placement="top">
                {evt.event}{" "}
                <Text as="span" fontSize="12px">
                  (from {evt._kontour.name}.sol)
                </Text>
              </TableCaption>
              <Thead>
                <Tr>
                  <Th>Event Key</Th>
                  <Th>Event Data</Th>
                </Tr>
              </Thead>
              <Tbody>
                <SubTable data={evt} indents={0} />
              </Tbody>
            </Table>
          </Box>
        );
      })}
    </Flex>
  );
}

EditorLogView.fragments = {
  instance: gql`
    fragment EditorLogViewInstanceFragment on Instance {
      id
      name
      status
      data
      project_id
      project_version_id
      contracts {
        id
        address
        contractSource {
          id
          name
          functions
          constructor
          abi
          events
        }
      }
      global_contracts {
        id
        address
        contractSource {
          id
          name
          functions
          constructor
          abi
          events
        }
      }
    }
  `,
};

export default EditorLogView;
