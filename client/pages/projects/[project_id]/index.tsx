import type { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";

import { Container, Text } from "@chakra-ui/react";
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
      project_id: project_id,
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
          <main>
            <ProjectVersionsList
              project_id={project.id}
              versions={project.versions}
            />

            {project.github_repo && (
              <GithubRepoForm repo={project.github_repo} />
            )}
          </main>
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
