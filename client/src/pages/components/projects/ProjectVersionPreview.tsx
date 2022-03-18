import { gql } from "@apollo/client";
import { Box, Link } from "@chakra-ui/react";
import { ProjectVersionPreviewFragment } from "@gql/__generated__/ProjectVersionPreviewFragment";
import NextLink from "next/link";

type Props = { version: ProjectVersionPreviewFragment };

export default function ProjectVersionPreview({ version }: Props) {
  return (
    <Box>
      <NextLink href={`/versions/${version.id}`} passHref>
        <Link>
          {version.name}: {version.id}
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
