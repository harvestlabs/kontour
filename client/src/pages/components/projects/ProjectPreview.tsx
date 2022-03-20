import { gql, useQuery } from "@apollo/client";
import { Box, Button, Link } from "@chakra-ui/react";
import { ProjectPreviewFragment } from "@gql/__generated__/ProjectPreviewFragment";
import NextLink from "next/link";
import colors from "src/theme/colors";

type Props = { project: ProjectPreviewFragment };

export default function ProjectPreview({ project }: Props) {
  return (
    <NextLink href={`/projects/${project.id}`} passHref>
      <Link color="contourWhite.500">
        <Box
          border={`1px solid ${colors.contourBorder[500]}`}
          p="24px"
          borderRadius="8px"
          _hover={{
            backgroundColor: `${colors.contourBlue[300]}`,
            color: `${colors.contourBlue[1000]}`,
          }}
        >
          {project.id}
        </Box>
      </Link>
    </NextLink>
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
