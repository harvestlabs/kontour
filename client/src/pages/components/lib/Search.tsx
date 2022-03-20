import {
  Box,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Spinner,
  Flex,
  InputProps,
} from "@chakra-ui/react";
import ImportGithubRepo from "@components/projects/editor/ImportGithubRepo";
import { Repos } from "@gql/__generated__/Repos";
import Fuse from "fuse.js";
import { useState, useMemo, PropsWithChildren } from "react";
import colors from "src/theme/colors";

const fuseOptions = {
  // isCaseSensitive: false,
  // includeScore: false,
  // shouldSort: true,
  // includeMatches: false,
  // findAllMatches: false,
  minMatchCharLength: 1,
  // location: 0,
  // threshold: 0.6,
  // distance: 100,
  // useExtendedSearch: false,
  // ignoreLocation: false,
  // ignoreFieldNorm: false,
  // fieldNormWeight: 1,
  keys: ["repo_name", "full_repo_name"],
};

type Props<T> = {
  data: T[];
  isLoading?: boolean;
  children: React.FC<{ key: number; item: T }>;
} & InputProps;
export default function Search<T>({
  data,
  children,
  isLoading = false,
  ...props
}: Props<T>) {
  const [searchValue, setSearchValue] = useState("");
  const fuse = useMemo(() => {
    return new Fuse<T>(data, fuseOptions);
  }, [data]);

  const searchResults = useMemo(() => {
    return searchValue !== ""
      ? fuse.search(searchValue).map((obj) => obj.item)
      : data || [];
  }, [fuse, data, searchValue]);

  return (
    <Box>
      <FormControl mb="12px">
        <FormLabel htmlFor="kontour-github">
          Search Github repositories
        </FormLabel>
        <Input
          id="kontour-github"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          {...props}
        />
        {isLoading ? (
          <FormHelperText display="flex" alignItems="center">
            <Spinner size="xs" mr="8px" />
            Loading...
          </FormHelperText>
        ) : searchValue !== "" ? (
          <FormHelperText>
            <b>{searchResults.length} results</b> found matching &quot;
            {searchValue}
            &quot;
          </FormHelperText>
        ) : (
          <FormHelperText>
            <b>{data.length || 0} results</b> to import from.
          </FormHelperText>
        )}
      </FormControl>
      {!isLoading && (
        <Flex
          maxHeight="400px"
          overflowY="scroll"
          border={`1px solid ${colors.contourBorder[500]}`}
          flexDirection="column"
        >
          <>
            {searchResults.map((item, idx) => {
              return <>{children && children({ key: idx, item })}</>;
            })}
          </>
        </Flex>
      )}
    </Box>
  );
}
