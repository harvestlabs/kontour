import { gql } from "@apollo/client";
import { Box, Link } from "@chakra-ui/react";
import { ProjectVersionPreviewFragment } from "@gql/__generated__/ProjectVersionPreviewFragment";
import NextLink from "next/link";
import colors from "src/theme/colors";

type Props = { version: ProjectVersionPreviewFragment };

export default function ProjectVersionPreview({ version }: Props) {
  return (
    <Box>
      <NextLink href={`/versions/${version.id}`} passHref>
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
            {version.name}: {version.id}
          </Box>
        </Link>
      </NextLink>
    </Box>
  );
}

ProjectVersionPreview.fragments = {
  version: gql`
    fragment ProjectVersionPreviewFragment on ProjectVersion {
      id
      name
    }
  `,
};
