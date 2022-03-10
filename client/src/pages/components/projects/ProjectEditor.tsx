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
import ProjectEditorNavbar from "@layouts/ProjectEditorNavbar";
import Footer from "@components/Footer";
import ProjectContractsSidebar from "./version/VersionContractsList";
import EditorContractView from "./editor/EditorContractView";

const sizeOfGutter = "30px";

function ProjectEditor({ id }: { id: string }) {
  const [sidebarWidth, setSidebarWidth] = useState(20);

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
    <Flex flexDirection="column" width="100vw" height="100vh">
      {!loading && data?.project != null ? (
        <ProjectEditorNavbar project={data?.project} />
      ) : null}
      <Flex bgColor="white" flexGrow="1">
        <Box width={`${sidebarWidth}%`} height="100%" bgColor="white">
          <ProjectContractsSidebar />
        </Box>
        <Box
          width={sizeOfGutter}
          height="100%"
          bgColor="black"
          cursor="col-resize"
        />
        <Box height="100%" bgColor="yellow" flexGrow="1">
          <EditorContractView />
        </Box>
      </Flex>
      <Footer />
    </Flex>
  );
}

export const PROJECT = gql`
  query ProjectQuery($project_id: String!) {
    project(id: $project_id) {
      id
      versions {
        id
        name
      }
      ...ProjectEditorNavbarFragment
    }
  }
  ${ProjectEditorNavbar.fragments.project}
`;

export default ProjectEditor;
