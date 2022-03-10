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

const ProjectsPage = () => {
  const router = useRouter();
  const user_id = useAppSelector(selectUserId);

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
        <ProjectList user_id={user_id} />
      </main>
    </Container>
  );
};
export default ProjectsPage;
