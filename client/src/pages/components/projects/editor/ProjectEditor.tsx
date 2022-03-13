import { gql, useMutation, useQuery } from "@apollo/client";
import { Spacer, HStack, Box, Flex, Divider } from "@chakra-ui/react";
import { v4 } from "uuid";
import { useAppSelector, useAppDispatch } from "src/redux/hooks";
import {
  setId,
  mergeData,
  selectData,
  setSelectedContractData,
} from "src/redux/slices/projectSlice";
import { useCallback, useEffect, useState } from "react";
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
import { useDispatch } from "react-redux";
import EditorInteractionView from "./EditorInteractionView";

const sizeOfGutter = "30px";

type Props = { version_id: string };
function ProjectEditor({ version_id }: Props) {
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
  const dispatch = useDispatch();
  useEffect(() => {
    const sources = data?.projectVersion?.contract_sources || [];
    if (data?.projectVersion?.contract_sources) {
      dispatch(setSelectedContractData(sources[0]));
    }
  }, [data, dispatch]);

  const projectVersion = data?.projectVersion;
  const project_id = projectVersion?.project_id;
  if (projectVersion && !project_id) {
    throw new Error("Project version cannot have no project_id");
  }
  console.log("projec", data, projectVersion, project_id, version_id);

  return (
    <Flex flexDirection="column" width="100vw" height="100vh">
      {projectVersion && project_id ? (
        <>
          <ProjectEditorNavbar
            project_id={project_id}
            version_id={version_id}
          />
          <Flex bgColor="white" flexGrow="1" minHeight="1px">
            <Box
              width={`${sidebarWidth}%`}
              height="100%"
              bgColor="white"
              flexShrink="0"
            >
              <VersionContractsList
                contract_sources={data?.projectVersion?.contract_sources || []}
                isPublished={data?.projectVersion?.status === 2}
                versionId={version_id}
              />
            </Box>
            <Box
              width={sizeOfGutter}
              height="100%"
              bgColor="black"
              cursor="col-resize"
              flexShrink="0"
            />
            <Box height="100%" bgColor="yellow" flexGrow="1">
              <EditorInteractionView />
            </Box>
          </Flex>
        </>
      ) : null}
      <Footer />
    </Flex>
  );
}

export const PROJECT_VERSION = gql`
  query ProjectVersionQuery($version_id: String!) {
    projectVersion(id: $version_id) {
      name
      status
      project_id
      contract_sources {
        ...VersionContractsListFragment
      }
    }
  }
  ${VersionContractsList.fragments.contract}
`;

export default ProjectEditor;
