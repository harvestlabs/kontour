import { gql, useQuery } from "@apollo/client";
import { Box, Button, Link } from "@chakra-ui/react";
import { ProjectPreviewFragment } from "@gql/__generated__/ProjectPreviewFragment";
import NextLink from "next/link";

type Props = { project: ProjectPreviewFragment };

export default function ProjectPreview({ project }: Props) {
  return (
    <Box>
      <NextLink href={`/projects/${project.id}`} passHref>
        <Link>{project.id}</Link>
      </NextLink>
    </Box>
  );
}

ProjectPreview.fragments = {
  project: gql`
    fragment ProjectPreviewFragment on Project {
      id
      data
    }
  `,
};
