import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Box, Button, Flex, Link } from "@chakra-ui/react";

import { withCookieAuth } from "@utils/auth";
import Layout from "src/pages/layouts/Layout";
import { Container } from "@chakra-ui/react";
import { NextPageWithLayout } from "types/next";
import AnimatedSVGLogo from "@components/logo/AnimatedSVGLogo";
import NextLink from "next/link";
import { selectUserId } from "@redux/slices/userSlice";
import { useAppSelector } from "@redux/hooks";
import SignInButton from "@components/buttons/SignInButton";
import { motion } from "framer-motion";
import * as Icons from "react-feather";

const Home: NextPageWithLayout = (props) => {
  const user_id = useAppSelector(selectUserId);

  return (
    <main>
      <Head>
        <title>kontour</title>
      </Head>
      <Flex
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        height="100vh"
      >
        <AnimatedSVGLogo size={300} />
        <Flex
          as={motion.div}
          alignItems="center"
          mt="60px"
          initial={{ opacity: 0, translateY: "14px" }}
          animate={{
            opacity: 1,
            translateY: 0,
            transition: { delay: 1.5, duration: 1 },
          }}
        >
          {user_id ? (
            <NextLink href="/projects" passHref>
              <Link>
                <Button
                  variant="ghost"
                  iconSpacing="4px"
                  rightIcon={<Icons.ArrowRight size={16} />}
                >
                  View Projects
                </Button>
              </Link>
            </NextLink>
          ) : (
            <SignInButton variant="ghost" />
          )}
        </Flex>
      </Flex>
    </main>
  );
};

// Home.getLayout = function getLayout(page) {
//   return <Layout>{page}</Layout>;
// };

export default Home;
