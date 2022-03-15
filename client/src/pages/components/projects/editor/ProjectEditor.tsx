import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { Spacer, HStack, Box, Flex, Divider } from "@chakra-ui/react";
import { v4 } from "uuid";
import { useAppSelector, useAppDispatch } from "src/redux/hooks";
import {
  setId,
  mergeData,
  selectData,
  setSelectedContractData,
  selectSelectedVersionId,
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
  const selectedVersionId = useAppSelector(selectSelectedVersionId);
  const [sidebarWidth, setSidebarWidth] = useState(20);
  const [projectId, setProjectId] = useState("");

  const [fetchVersion, { data, loading, error }] = useLazyQuery<
    ProjectVersionQuery,
    ProjectVersionQueryVariables
  >(PROJECT_VERSION, {
    fetchPolicy: "network-only",
  });
  const dispatch = useDispatch();

  // in case the user changes versions
  const currentVersionId = selectedVersionId ? selectedVersionId : version_id;

  useEffect(() => {
    fetchVersion({
      variables: {
        version_id: currentVersionId,
      },
    });
  }, [currentVersionId, fetchVersion]);

  useEffect(() => {
    const sources = data?.projectVersion?.contract_sources || [];
    if (data?.projectVersion?.contract_sources) {
      dispatch(setSelectedContractData(sources[0]));
    }
    if (
      data?.projectVersion?.project_id &&
      data?.projectVersion?.project_id !== projectId
    ) {
      setProjectId(data?.projectVersion?.project_id);
    }
  }, [data, dispatch, projectId]);

  const projectVersion = data?.projectVersion;
  const newProjectVersionProjectId = projectVersion?.project_id;
  if (projectVersion && !newProjectVersionProjectId) {
    throw new Error("Project version cannot have no project_id");
  }

  return (
    <Flex flexDirection="column" width="100vw" height="100vh">
      {projectId ? (
        <>
          <ProjectEditorNavbar
            project_id={projectId}
            version_id={currentVersionId}
            instance_id={projectVersion?.head_instance?.id}
          />
          <Flex bgColor="white" flexGrow="1" minHeight="1px">
            <Box
              width={`${sidebarWidth}%`}
              height="100%"
              bgColor="white"
              flexShrink="0"
            >
              <VersionContractsList
                contract_sources={projectVersion?.contract_sources || []}
                isPublished={projectVersion?.status === 2}
                versionId={currentVersionId}
              />
            </Box>
            <Box
              width={sizeOfGutter}
              height="100%"
              bgColor="black"
              cursor="col-resize"
              flexShrink="0"
            />
            <Box height="100%" bgColor="lightgoldenrodyellow" flexGrow="1">
              <EditorInteractionView instance={projectVersion?.head_instance} />
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
      node_id
      contract_sources {
        ...VersionContractsListFragment
      }
      head_instance {
        ...InstanceFragment
      }
    }
  }
  ${VersionContractsList.fragments.contract}
  ${EditorInteractionView.fragments.instance}
`;

export default ProjectEditor;
