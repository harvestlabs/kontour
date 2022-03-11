import { gql, useMutation, useQuery } from "@apollo/client";
import { Spacer, HStack, Box, Flex, Divider } from "@chakra-ui/react";
import { v4 } from "uuid";
import Datasource from "../Datasource";
import { useAppSelector, useAppDispatch } from "src/redux/hooks";
import { setId, mergeData, selectData } from "src/redux/slices/projectSlice";
import { useCallback, useState } from "react";
import {
  ProjectQuery,
  ProjectQueryVariables,
} from "@gql/__generated__/ProjectQuery";
import ProjectEditorNavbar from "@layouts/ProjectEditorNavbar";
import Footer from "@components/Footer";
import VersionContractsList from "../version/VersionContractsList";
import EditorContractView from "./EditorContractView";
import {
  ProjectVersionQuery,
  ProjectVersionQueryVariables,
} from "@gql/__generated__/ProjectVersionQuery";

const sizeOfGutter = "30px";

type Props = { project_id: string; version_id: string };
function ProjectEditor({ project_id, version_id }: Props) {
  const [sidebarWidth, setSidebarWidth] = useState(20);

  const { data, loading, error } = useQuery<
    ProjectVersionQuery,
    ProjectVersionQueryVariables
  >(PROJECT_VERSION, {
    fetchPolicy: "network-only",
    variables: {
      version_id: version_id,
    },
  });

  return (
    <Flex flexDirection="column" width="100vw" height="100vh">
      <ProjectEditorNavbar project_id={project_id} version_id={version_id} />
      <Flex bgColor="white" flexGrow="1">
        <Box width={`${sidebarWidth}%`} height="100%" bgColor="white">
          <VersionContractsList
            contract_sources={data?.projectVersion?.contract_sources || []}
          />
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

export const PROJECT_VERSION = gql`
  query ProjectVersionQuery($version_id: String!) {
    projectVersion(id: $version_id) {
      name
      contract_sources {
        ...VersionContractsListFragment
      }
    }
  }
  ${VersionContractsList.fragments.contract}
`;

export default ProjectEditor;
