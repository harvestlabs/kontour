import type { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";

import { Text, Container, Heading, Flex, Divider } from "@chakra-ui/react";
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
      <Flex flexDirection="column" as="main" alignItems="center" mt="60px">
        <Heading fontSize="28px" variant="nocaps" mb="16px" layerStyle="purple">
          Import Project from Github
        </Heading>
        <ImportGithubRepo onCreated={onCreated} />
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
          mb="40px"
          layerStyle="yellowLight"
        >
          Browse Existing Projects
        </Heading>
        <ProjectList user_id={user_id} />
      </Flex>
    </Container>
  );
};

ProjectsPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default ProjectsPage;
