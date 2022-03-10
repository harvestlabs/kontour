import React from "react";
import Footer from "@components/Footer";
import ProjectEditorNavbar from "./ProjectEditorNavbar";
import { Box, Flex } from "@chakra-ui/react";

type Props = {};
export default function ProjectEditorLayout({
  children,
}: React.PropsWithChildren<Props>) {
  return (
    <Flex as="main" flexDirection="column" width="100vw" height="100vh">
      <ProjectEditorNavbar />
      <Box flexGrow="1">{children}</Box>
      <Footer />
    </Flex>
  );
}
