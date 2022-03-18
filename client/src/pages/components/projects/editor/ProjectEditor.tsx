import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  Spacer,
  Text,
  HStack,
  Box,
  Flex,
  Divider,
  useToast,
} from "@chakra-ui/react";
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
import EditorLogView from "./EditorLogView";

const sizeOfGutter = "30px";

type Props = { version_id: string; page?: EDITOR_PAGE };

export enum EDITOR_PAGE {
  INTERACTIVE = "interactive",
  LOGS = "logs",
}

function ProjectEditor({ version_id, page = EDITOR_PAGE.INTERACTIVE }: Props) {
  const selectedVersionId = useAppSelector(selectSelectedVersionId);
  const [sidebarWidth, setSidebarWidth] = useState(20);
  const [projectId, setProjectId] = useState("");
  const toast = useToast();

  const [fetchVersion, { data, loading, error }] = useLazyQuery<
    ProjectVersionQuery,
    ProjectVersionQueryVariables
  >(PROJECT_VERSION, {
    fetchPolicy: "network-only",
  });
  const dispatch = useDispatch();

  // in case the user changes versions
  const currentVersionId = selectedVersionId ? selectedVersionId : version_id;

  // for every contract in the instance, set up a listener that shows a toast

  useEffect(() => {
    // @ts-ignore
    const kontour = window.kontour;
    const listeners: any[] = [];

    const instance = data?.projectVersion?.head_instance;
    // for every contract, we want to set up listeners on every event
    instance?.contracts?.map((contract) => {
      let { address } = contract;
      let {
        events,
        abi,
        name: contractSourceName,
      }: {
        name: string;
        functions: ContractSourceFunction[];
        events: ContractSourceEvent[];
        // contructor: ContractSourceConstructor;
        abi: any;
      } = contract?.contractSource || {};

      const abiJson = JSON.parse(JSON.stringify(abi));

      const web3Contract = new kontour.web3.eth.Contract(abiJson, address);

      // for every event on this contract set up the listener and add it to the top level listeners array so it can be removed on remount
      listeners.push(
        web3Contract.events.allEvents({}, (err: any, e: any) => {
          toast({
            title: (
              <Box>
                <Text fontWeight="300" color="white">
                  Event triggered! <b>{e.event}</b> on{" "}
                  <b>{contractSourceName}.sol</b>
                </Text>
                <Box>Return Values:</Box>
                {Object.keys(e?.returnValues).map((key) => {
                  const val = e?.returnValues || {};
                  return (
                    <Text
                      fontWeight="300"
                      key={key}
                      variant="ellipsis"
                      color="white"
                    >
                      <b>{key}:</b> {val[key]}
                    </Text>
                  );
                })}
              </Box>
            ),
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        })
      );
    });
    return () => {
      listeners.map((emitter: any) => emitter.removeAllListeners());
    };
  }, [data?.projectVersion?.head_instance, toast]);

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
            sdk_url={projectVersion?.sdk_url!}
          />
          <Flex flexGrow="1" minHeight="1px">
            <Box height="100%" flexGrow="1">
              {page === EDITOR_PAGE.LOGS ? (
                <EditorLogView instance={projectVersion?.head_instance!} />
              ) : (
                <EditorInteractionView
                  instance={projectVersion?.head_instance}
                />
              )}
            </Box>
            <VersionContractsList
              contract_sources={projectVersion?.contract_sources || []}
              isPublished={projectVersion?.status === 2}
              versionId={currentVersionId}
              projectId={projectId}
              instance={projectVersion?.head_instance}
            />
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
      sdk_url
      contract_sources {
        ...VersionContractsListFragment
      }
      head_instance {
        ...VersionContractsListInstanceFragment
        ...InstanceFragment
        ...EditorLogViewInstanceFragment
        contracts {
          address
          contractSource {
            id
            name
            abi
            events
          }
        }
      }
    }
  }
  ${VersionContractsList.fragments.contract}
  ${VersionContractsList.fragments.instance}
  ${EditorInteractionView.fragments.instance}
  ${EditorLogView.fragments.instance}
`;

export default ProjectEditor;
