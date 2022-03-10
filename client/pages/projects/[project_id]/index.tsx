import type { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";

import { getLocalStorageKey } from "@utils/api_client";
import { Container } from "@chakra-ui/react";
import { gql, useQuery } from "@apollo/client";
import Project from "@components/projects/Project";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  reset,
  setData,
  mergeData,
  selectData,
} from "src/redux/slices/projectSlice";
import Layout from "@layouts/Layout";
import { NextPageWithLayout } from "types/next";

const PROJECT = gql`
  query Project($id: String!) {
    project(id: $id) {
      id
      data
    }
  }
`;

const ProjectPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { project_id } = router?.query;
  const dispatch = useDispatch();

  const { data, loading, error } = useQuery(PROJECT, {
    variables: { id: project_id },
  });
  useEffect(() => {
    if (data) {
      dispatch(setData(data.project?.data));
    }
  }, [data, dispatch]);

  return (
    <Container maxW="container.lg" variant="base">
      <Head>
        <title>Project</title>
      </Head>
      <main>{data ? <Project id={data.project?.id as string} /> : null}</main>
    </Container>
  );
};

ProjectPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
export default ProjectPage;
