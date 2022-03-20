import { gql, useMutation } from "@apollo/client";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useAuthenticatedSubscription } from "@hooks/index";
import { useAppSelector } from "@redux/hooks";
import { selectUserId } from "@redux/slices/userSlice";
import {
  OnBuildLogsSubscription,
  OnBuildLogsSubscriptionVariables,
} from "@gql/__generated__/OnBuildLogsSubscription";
import colors from "src/theme/colors";
import { useEffect, useState } from "react";

interface BuildStatusProps {
  repoId: string;
}
type BuildLog = {
  message: string;
  buildId: string;
};

function BuildStatus({ repoId }: BuildStatusProps) {
  const { data, loading } = useAuthenticatedSubscription<
    OnBuildLogsSubscription,
    OnBuildLogsSubscriptionVariables
  >(BUILD_SUBSCRIPTION, {
    variables: { buildId: repoId },
  });
  const [logs, setLogs] = useState<BuildLog[]>([]);

  useEffect(() => {
    if (data?.subscribeToBuild) {
      setLogs([...logs, data.subscribeToBuild as BuildLog]);
    }
    // do not add logs here, will cause infinite
  }, [data]);

  return (
    <>
      <Text fontSize="24px" mb="12px">
        Currently deploying build...
      </Text>
      <Flex
        flexFlow="column"
        maxHeight="640px"
        overflowY="scroll"
        bgColor={colors.contourBackgroundDarker}
      >
        {logs.map((l, idx) => (
          <BuildLogMessage log={l} key={idx} />
        ))}
      </Flex>
    </>
  );
}

function BuildLogMessage({ log }: { log: BuildLog }) {
  return (
    <>
      {log.message.split("\n").map((text, idx) => (
        <Box key={idx} width="100%" alignItems="center" px="24px">
          <Text>{text}</Text>
        </Box>
      ))}
    </>
  );
}

const BUILD_SUBSCRIPTION = gql`
  subscription OnBuildLogsSubscription($buildId: String!) {
    subscribeToBuild(buildId: $buildId)
  }
`;

export default BuildStatus;
