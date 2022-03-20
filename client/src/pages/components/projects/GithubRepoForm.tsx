import { gql, useMutation } from "@apollo/client";
import {
  Button,
  FormLabel,
  Heading,
  Input,
  Link,
  Radio,
  RadioGroup,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useAppSelector } from "@redux/hooks";
import { selectUserId } from "@redux/slices/userSlice";
import {
  UpdateDeployParams,
  UpdateDeployParamsVariables,
} from "@gql/__generated__/UpdateDeployParams";
import {
  DeployFromRepo,
  DeployFromRepoVariables,
} from "@gql/__generated__/DeployFromRepo";
import { GithubRepoFormFragment } from "@gql/__generated__/GithubRepoFormFragment";
import { useState } from "react";
import BuildStatus from "./BuildStatus";
import colors from "src/theme/colors";

const DEPLOY_FROM_REPO = gql`
  mutation DeployFromRepo($id: String!) {
    deployFromRepo(id: $id) {
      id
      deploy_status
    }
  }
`;

const UPDATE_DEPLOY_PARAMS = gql`
  mutation UpdateDeployParams($id: String!, $deploy_params: JSONObject!) {
    updateDeployParams(id: $id, deploy_params: $deploy_params) {
      id
    }
  }
`;

type Props = {
  repo: GithubRepoFormFragment;
};

function GithubRepoForm({ repo }: Props) {
  const [updateDeployParams, { loading, error }] = useMutation<
    UpdateDeployParams,
    UpdateDeployParamsVariables
  >(UPDATE_DEPLOY_PARAMS);
  const [deployFromRepo, e3] = useMutation<
    DeployFromRepo,
    DeployFromRepoVariables
  >(DEPLOY_FROM_REPO);

  const [buildType, setBuildType] = useState<string>(repo?.deploy_data?.type);
  const [branch, setBranch] = useState<string>(repo?.deploy_data?.branch);
  const [buildDir, setBuildDir] = useState<string>(repo?.deploy_data?.buildDir);
  const [buildCmd, setBuildCmd] = useState<string>(repo?.deploy_data?.buildCmd);
  const [deployScript, setDeployScript] = useState<string>(
    repo?.deploy_data?.deployScript
  );
  const [isDeploying, setIsDeploying] = useState<number>(repo?.deploy_status);

  const saveRepoFormAndDeploy = async () => {
    await updateDeployParams({
      variables: {
        id: repo.id,
        deploy_params: {
          type: buildType,
          branch: branch,
          buildDir: buildDir,
          buildCmd: buildCmd,
          deployScript: deployScript,
        },
      },
    });
    await deployFromRepo({
      variables: {
        id: repo.id,
      },
    });
    setIsDeploying(1);
  };

  return (
    <>
      <Text fontWeight="300" fontSize="16px">
        from{" "}
        <Link
          color={colors.contourRedLight[400]}
          fontWeight="700"
          href={`https://www.github.com/${repo.handle}/${repo.repo_name}`}
          target="_blank"
        >
          {repo.repo_name}
        </Link>
        {", "}
        by{" "}
        <Link
          color={colors.contourRedLight[400]}
          href={`https://www.github.com/${repo.handle}`}
          target="_blank"
          fontWeight="700"
        >
          {repo.handle}
        </Link>
      </Text>
      <FormLabel mt="12px">Branch to build</FormLabel>
      <Input
        size="sm"
        onChange={(e) => setBranch(e.target.value)}
        placeholder="master"
        value={branch}
      />
      <FormLabel mt="12px">Build directory</FormLabel>
      <Input
        size="sm"
        onChange={(e) => setBuildDir(e.target.value)}
        placeholder="./"
        value={buildDir}
      />
      <FormLabel mt="12px">Build command</FormLabel>
      <Input
        size="sm"
        onChange={(e) => setBuildCmd(e.target.value)}
        placeholder="npm install"
        value={buildCmd}
      />
      <FormLabel mt="12px">(Optional) deploy script</FormLabel>
      <Input
        size="sm"
        onChange={(e) => setDeployScript(e.target.value)}
        placeholder="./deploy.js"
        value={deployScript}
      />
      <RadioGroup mt="12px" onChange={setBuildType} value={buildType} size="sm">
        <Radio pr="10" value="hardhat">
          Hardhat
        </Radio>
        <Radio value="truffle">Truffle</Radio>
      </RadioGroup>
      {buildType === "truffle" ? (
        <>
          <FormLabel mt="12px">Truffle config file</FormLabel>
          <Input placeholder="./truffle-config.js" size="sm" />
        </>
      ) : null}
      {isDeploying !== 1 ? (
        <Button
          mt="24px"
          isLoading={loading}
          isDisabled={loading}
          onClick={saveRepoFormAndDeploy}
          width="250px"
          alignSelf="center"
          colorScheme="blue"
        >
          Deploy from Github
        </Button>
      ) : (
        <>
          <Text
            fontSize="20px"
            fontWeight="bold"
            my="12px"
            display="flex"
            alignItems="center"
            alignSelf="center"
            layerStyle="blue"
          >
            <Spinner size="sm" mr="8px" />
            Deploying build...
          </Text>
          <BuildStatus repoId={repo.id} />
        </>
      )}
    </>
  );
}

GithubRepoForm.fragments = {
  repo: gql`
    fragment GithubRepoFormFragment on GithubRepo {
      id
      repo_name
      handle
      deploy_status
      deploy_data
      user_id
    }
  `,
};

export default GithubRepoForm;
