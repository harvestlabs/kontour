import { gql, useMutation } from "@apollo/client";
import {
  Button,
  Grid,
  GridItem,
  Spacer,
  HStack,
  VStack,
  Text,
  Box,
} from "@chakra-ui/react";
import { v4 } from "uuid";
import Datasource from "./Datasource";
import { useAppSelector, useAppDispatch } from "@redux/hooks";
import {
  reset,
  setData,
  mergeData,
  selectData,
} from "@redux/slices/projectSlice";
import SimpleContainer from "@components/displays/SimpleContainer";
import SimpleInteraction from "@components/interactions/SimpleInteraction";
import Page from "@components/pages/SimplePage";
import airdrop from "@utils/airdrop";

const UPDATE = gql`
  mutation UpdateProject($id: String!, $data: JSONObject!) {
    updateProject(id: $id, data: $data) {
      id
      data
    }
  }
`;

function Project({ id }: { id: string }) {
  const project = useAppSelector(selectData);
  const dispatch = useAppDispatch();
  const [update, { loading, error }] = useMutation(UPDATE);
  const datasources = project?.datasources || [];
  const displays = project?.displays || [];
  const interactions = project?.interactions || [];

  const newContract = async () => {
    const newId = v4();
    const resp = await update({
      variables: {
        id: id,
        data: {
          datasources: {
            ...project?.datasources,
            [newId]: { type: "CONTRACT" },
          },
        },
      },
    });
    if (resp.data?.data) {
      dispatch(mergeData(resp.data.data));
    }
  };
  const newComponent = async (type: "display" | "interaction") => {
    const newId = v4();
    const key = type === "display" ? "displays" : "interactions";
    const existing =
      type === "display" ? project?.displays : project?.interactions;
    const resp = await update({
      variables: {
        id: id,
        data: {
          [key]: {
            ...existing,
            [newId]: { type: "SIMPLE" },
          },
        },
      },
    });
    if (resp.data?.data) {
      dispatch(mergeData(resp.data.data));
    }
  };
  const updateDatasource = async (datasourceId: string, data: any) => {
    const resp = await update({
      variables: {
        id: id,
        data: {
          datasources: {
            ...project.datasources,
            [datasourceId]: data,
          },
        },
      },
    });
    if (resp.data?.data) {
      dispatch(mergeData(resp.data.data));
    }
  };
  const updateComponent = (type: "display" | "interaction") => {
    return async (displayId: string, data: any) => {
      const key = type === "display" ? "displays" : "interactions";
      const existing =
        type === "display" ? project?.displays : project?.interactions;
      const resp = await update({
        variables: {
          id: id,
          data: {
            [key]: {
              ...existing,
              [displayId]: data,
            },
          },
        },
      });
      if (resp.data?.data) {
        dispatch(mergeData(resp.data.data));
      }
    };
  };
  const updatePage = async (data: string[]) => {
    const existing = project?.page?.components || [];
    const resp = await update({
      variables: {
        id: id,
        data: {
          page: {
            ...project?.page,
            components: [...existing, ...data],
          },
        },
      },
    });
    if (resp.data?.data) {
      dispatch(mergeData(resp.data.data));
    }
  };

  return (
    <>
      <VStack style={{ marginBottom: "64px" }}>
        <div>Data: {JSON.stringify(project)}</div>
        <Button onClick={() => airdrop()}>Airdrop</Button>
        <HStack>
          <Button onClick={() => newContract()}>New Contract Datasource</Button>
          <Button onClick={() => newComponent("display")}>
            New Display Component
          </Button>
          <Button onClick={() => newComponent("interaction")}>
            New Interaction Component
          </Button>
        </HStack>
      </VStack>
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        <GridItem>
          <Text>
            <b>Datasources</b>
          </Text>
          <div>
            {Object.keys(datasources).map((id: string) => {
              return (
                <div key={id}>
                  <Datasource
                    id={id}
                    data={datasources[id]}
                    update={updateDatasource}
                  />
                </div>
              );
            })}
          </div>
        </GridItem>
        <GridItem>
          <Text>
            <b>Displays</b>
          </Text>
          <div>
            {Object.keys(displays).map((id: string) => {
              return (
                <div key={id}>
                  <SimpleContainer
                    id={id}
                    data={displays[id]}
                    update={updateComponent("display")}
                    updatePage={updatePage}
                  />
                </div>
              );
            })}
          </div>
        </GridItem>
        <GridItem>
          <Text>
            <b>Interactions</b>
          </Text>
          {Object.keys(interactions).map((id: string) => {
            return (
              <div key={id}>
                <SimpleInteraction
                  id={id}
                  data={interactions[id]}
                  update={updateComponent("interaction")}
                  updatePage={updatePage}
                />
              </div>
            );
          })}
        </GridItem>
      </Grid>
      <Box margin={6}>
        <Text>
          <b>Your Page</b>
        </Text>
        <Box margin={6}>
          <Page data={project?.page} />
        </Box>
      </Box>
    </>
  );
}

export default Project;
