import type { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";

import { Container } from "@chakra-ui/react";
import { gql, useQuery } from "@apollo/client";
import ProjectList from "@components/projects/ProjectList";
import { useAppSelector } from "@redux/hooks";
import { selectUserId } from "@redux/slices/userSlice";
import { NextPageWithLayout } from "types/next";
import Layout from "@layouts/Layout";
import RequestApiKey from "@components/apiKey/RequestApiKey";
import { useState } from "react";

const AlphaPage: NextPageWithLayout = () => {
  const router = useRouter();
  const user_id = useAppSelector(selectUserId);

  const onCreated = (id: string) => {
    window.location.href = `/versions/${id}`;
  };
  return (
    <Container maxW="container.lg" variant="base">
      <Head>
        <title>Request an alpha key:</title>
      </Head>
      <main>
        <RequestApiKey />
      </main>
    </Container>
  );
};

AlphaPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default AlphaPage;
