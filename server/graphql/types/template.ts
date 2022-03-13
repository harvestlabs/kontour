import { GraphQLEnumType } from "graphql";
import { ContractTemplate } from "../../models/RemoteContractSource.model";

export const TemplateType = new GraphQLEnumType({
  name: "Template",
  values: {
    STORAGE: {
      value: ContractTemplate.SIMPLE_STORAGE,
      description: "A template for simple variable storage",
    },
    ERC721: {
      value: ContractTemplate.SIMPLE_ERC721,
      description: "A template for minting simple NFTs",
    },
  },
});
