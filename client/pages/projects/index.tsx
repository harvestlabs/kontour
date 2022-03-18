import type { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";

import { Container } from "@chakra-ui/react";
import ProjectList from "@components/projects/ProjectList";
import { useAppSelector } from "@redux/hooks";
import { selectUserId } from "@redux/slices/userSlice";
import { NextPageWithLayout } from "types/next";
import Layout from "@layouts/Layout";
import ImportGithubRepo from "@components/projects/editor/ImportGithubRepo";

const ProjectsPage: NextPageWithLayout = () => {
  const router = useRouter();
  const user_id = useAppSelector(selectUserId);

  const onCreated = (id: string) => {
    router.push(`/projects/${id}`);
  };
  return (
    <Container maxW="container.lg" variant="base">
      <Head>
        <title>Create a Project</title>
      </Head>
      <main>
        <ProjectList user_id={user_id} />
        <ImportGithubRepo onCreated={onCreated} />
      </main>
    </Container>
  );
};

ProjectsPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default ProjectsPage;
