import { gql, useMutation, useQuery } from "@apollo/client";
import { Spacer, HStack, Box, Flex, Divider } from "@chakra-ui/react";
import { v4 } from "uuid";
import Datasource from "./Datasource";
import { useAppSelector, useAppDispatch } from "src/redux/hooks";
import { setId, mergeData, selectData } from "src/redux/slices/projectSlice";
import { useCallback, useState } from "react";
import {
  ProjectQuery,
  ProjectQueryVariables,
} from "@gql/__generated__/ProjectQuery";

const sizeOfGutter = "30px";

function ProjectEditor({ id }: { id: string }) {
  const project = useAppSelector(selectData);
  const [sidebarWidth, setSidebarWidth] = useState(20);

  const dispatch = useAppDispatch();
  console.log("id", id);

  const { data, loading, error } = useQuery<
    ProjectQuery,
    ProjectQueryVariables
  >(PROJECT, {
    fetchPolicy: "network-only",
    variables: {
      project_id: id,
    },
  });
  console.log("data", data, id);

  return (
    <Flex width="100%" height="100%" bgColor="white">
      <Box width={`${sidebarWidth}%`} height="100%" bgColor="white"></Box>
      <Box
        width={sizeOfGutter}
        height="100%"
        bgColor="black"
        cursor="col-resize"
      ></Box>
      <Box height="100%" bgColor="yellow" flexGrow="1"></Box>
    </Flex>
  );
}

export const PROJECT = gql`
  query ProjectQuery($project_id: String!) {
    project(id: $project_id) {
      id
      versions {
        id
      }
    }
  }
`;

export default ProjectEditor;
