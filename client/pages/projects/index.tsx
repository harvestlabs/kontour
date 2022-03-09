import type { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";

import { Container } from "@chakra-ui/react";
import CreateProject from "@components/projects/CreateProject";
import { gql, useQuery } from "@apollo/client";
import ProjectList from "@components/projects/ProjectList";

const ProjectsPage = () => {
  const router = useRouter();

  const onCreated = (id: string) => {
    window.location.href = `/projects/${id}`;
  };
  return (
    <Container maxW="container.lg" variant="base">
      <Head>
        <title>Create a Project</title>
      </Head>
      <main>
        <CreateProject onComplete={onCreated} />
        <ProjectList />
      </main>
    </Container>
  );
};
export default ProjectsPage;
