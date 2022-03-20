import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Box, Text, Button, Flex, Link, Heading } from "@chakra-ui/react";

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
        <Flex width="300px" height="300px" position="relative">
          <Box
            as={motion.div}
            position="relative"
            initial={{ translateX: 0 }}
            animate={{
              opacity: 1,
              translateX: "-100px",
              transition: { delay: 1.5, duration: 1 },
            }}
          >
            <AnimatedSVGLogo position="absolute" size={300} />
          </Box>

          <Flex
            as={motion.div}
            alignItems="center"
            flexDirection="column"
            justifyContent="center"
            initial={{ opacity: 0, translateX: "175px" }}
            animate={{
              opacity: 1,
              translateX: "225px",
              transition: { delay: 1.5, duration: 1 },
            }}
          >
            <Heading
              fontSize="40px"
              letterSpacing="10px"
              layerStyle="yellowLight"
              textAlign="center"
              mt="32px"
              mb="12px"
            >
              kontour
            </Heading>
            {user_id ? (
              <NextLink href="/projects" passHref>
                <Link>
                  <Button
                    variant="ghost"
                    colorScheme="contourBlue"
                    iconSpacing="4px"
                    rightIcon={<Icons.ArrowRight size={16} />}
                    size="xl"
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
      </Flex>
    </main>
  );
};

// Home.getLayout = function getLayout(page) {
//   return <Layout>{page}</Layout>;
// };

export default Home;
