import type { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";

import { Container } from "@chakra-ui/react";
import CreateProject from "@components/projects/CreateProject";
import { gql, useQuery } from "@apollo/client";
import ProjectList from "@components/projects/ProjectList";
import { useAppSelector } from "@redux/hooks";
import { selectUserId } from "@redux/slices/userSlice";
import { NextPageWithLayout } from "types/next";
import Layout from "@layouts/Layout";
import ProjectVersionsList from "@components/projects/ProjectVersionsList";

const ProjectVersionListPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { project_id } = router?.query;
  console.log(router);

  return (
    <Container maxW="container.lg" variant="base">
      <Head>
        <title>Create a Project</title>
      </Head>
      <main>
        {project_id ? (
          <ProjectVersionsList project_id={project_id} />
        ) : (
          "no project found"
        )}
      </main>
    </Container>
  );
};

ProjectVersionListPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default ProjectVersionListPage;
