import type { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";

import { Container, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import { gql, useQuery } from "@apollo/client";
import ProjectList from "@components/projects/ProjectList";
import { useAppSelector } from "@redux/hooks";
import { selectUserId } from "@redux/slices/userSlice";
import { NextPageWithLayout } from "types/next";
import Layout from "@layouts/Layout";
import ProjectVersionsList from "@components/projects/ProjectVersionsList";
import ProjectVersionPreview from "@components/projects/ProjectVersionPreview";
import GithubRepoForm from "@components/projects/GithubRepoForm";

export const PROJECT_VERSIONS = gql`
  query ProjectVersionsListQuery($project_id: String!) {
    project(id: $project_id) {
      id
      data
      user_id
      github_repo {
        id
        handle
        repo_name
        ...GithubRepoFormFragment
      }
      versions {
        id
        name
        ...ProjectVersionPreviewFragment
      }
    }
  }
  ${ProjectVersionPreview.fragments.version}
  ${GithubRepoForm.fragments.repo}
`;

const ProjectVersionListPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { project_id } = router?.query;
  const { data, loading, error } = useQuery(PROJECT_VERSIONS, {
    variables: {
      project_id: project_id || "",
    },
  });

  const project = data?.project;

  return (
    <Container maxW="container.lg" variant="base">
      {project ? (
        <>
          <Head>
            <title>{project.data.name || "Untitled project"}</title>
          </Head>
          <Flex flexDirection="column" as="main" mt="60px">
            <Heading
              layerStyle="blue"
              fontWeight="700"
              variant="nocaps"
              fontSize="60px"
              alignSelf="center"
              mb="24px"
            >
              {project.data.name || "Untitled project"}
            </Heading>
            <Heading fontSize="28px" variant="nocaps" layerStyle="purple">
              Deploy New Version from Github
            </Heading>
            {project.github_repo && (
              <GithubRepoForm repo={project.github_repo} />
            )}

            <Flex alignSelf="center" alignItems="center" width="80%" py="50px">
              <Divider />
              <Text fontSize="24px" px="24px">
                <b>
                  <i>or </i>
                </b>
              </Text>
              <Divider />
            </Flex>
            <Heading
              fontSize="28px"
              variant="nocaps"
              layerStyle="yellowLight"
              mb="40px"
            >
              Open Existing Version
            </Heading>
            <ProjectVersionsList
              project_id={project.id}
              versions={project.versions}
            />
          </Flex>
        </>
      ) : loading ? (
        <Text>Loading...</Text>
      ) : (
        <Text>{"Whoops, there's no project here"}</Text>
      )}
    </Container>
  );
};

ProjectVersionListPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default ProjectVersionListPage;
