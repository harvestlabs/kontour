import { gql, useQuery } from "@apollo/client";
import {
  Text,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Menu,
} from "@chakra-ui/react";
import * as Icons from "react-feather";
import {
  InstancesSelectorQuery,
  InstancesSelectorQueryVariables,
} from "@gql/__generated__/InstancesSelectorQuery";

import { useState } from "react";

type Props = {
  version_id: string;
  instance_id?: string;
};

export default function EditorInstanceSelector({
  version_id,
  instance_id,
}: Props) {
  const [selectedInstanceName, setSelectedInstanceName] = useState(instance_id);
  const { data, loading, error } = useQuery<
    InstancesSelectorQuery,
    InstancesSelectorQueryVariables
  >(INSTANCES_SELECTOR_QUERY, {
    fetchPolicy: "network-only",
    variables: {
      version_id,
    },
  });

  const instances = data?.instancesForProjectVersion || [];

  return (
    <Menu>
      <MenuButton
        size="sm"
        borderRadius="0"
        as={Button}
        rightIcon={<Icons.ChevronDown size="16" />}
      >
        <Text variant="ellipsis">{selectedInstanceName || "ERROR"}</Text>
      </MenuButton>

      <MenuList>
        {instances?.map((v) => {
          const id = v?.id;
          return id != null ? (
            <MenuItem
              value={v?.id}
              key={v?.id}
              onClick={() => {
                setSelectedInstanceName(id);
                // dispatch(setSelectedVersionId(v.id));
              }}
            >
              {id}
            </MenuItem>
          ) : null;
        })}
      </MenuList>
    </Menu>
  );
}

export const INSTANCES_SELECTOR_QUERY = gql`
  query InstancesSelectorQuery($version_id: String!) {
    instancesForProjectVersion(projectVersionId: $version_id) {
      id
      name
    }
  }
`;
