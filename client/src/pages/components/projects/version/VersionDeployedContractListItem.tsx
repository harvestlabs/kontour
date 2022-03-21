import React, { useState } from "react";
import { ListIcon, ListItem } from "@chakra-ui/react";
import { gql, useMutation } from "@apollo/client";
import { VersionDeployedContractListItemFragment } from "@gql/__generated__/VersionDeployedContractListItemFragment";
import { Icon } from "react-feather";

type Props = {
  contract: VersionDeployedContractListItemFragment;
  icon?: Icon;
};
export default function VersionDeployedContractListItem({
  icon,
  contract,
}: Props) {
  const [hover, setHover] = useState(false);
  return (
    <ListItem
      display="flex"
      alignItems="center"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {icon ? <ListIcon as={icon} width="12px" /> : null}
      {contract?.contractSource?.name}:{" "}
      {hover ? contract.address : contract.address.substring(0, 8)}...
    </ListItem>
  );
}

VersionDeployedContractListItem.fragments = {
  contract: gql`
    fragment VersionDeployedContractListItemFragment on Contract {
      id
      address
      contractSource {
        id
        name
        functions
        constructor
        abi
        events
        source_type
      }
    }
  `,
};
