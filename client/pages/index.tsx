import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Link } from "@chakra-ui/react";

import { withCookieAuth } from "@utils/auth";
import Layout from "src/pages/layouts/Layout";
import { NextPageWithLayout } from "types/types";
import { Container } from "@chakra-ui/react";

const Home: NextPageWithLayout = (props) => {
  return (
    <Container maxW="container.lg" variant="base">
      <Head>
        <title>Create a Project</title>
      </Head>
      <main>
        Hi
        <Link>this is link</Link>
      </main>
    </Container>
  );
};

Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default Home;
