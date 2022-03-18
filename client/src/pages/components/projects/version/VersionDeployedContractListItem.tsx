import React from "react";
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
  return (
    <ListItem display="flex" alignItems="center">
      {icon ? <ListIcon as={icon} width="12px" /> : null}
      {contract?.contractSource?.name}.sol
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
      }
    }
  `,
};
