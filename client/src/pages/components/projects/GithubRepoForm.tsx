import { gql, useMutation } from "@apollo/client";
import {
  Button,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
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
      <FormLabel pt="6">Branch to build</FormLabel>
      <Input
        onChange={(e) => setBranch(e.target.value)}
        placeholder="master"
        value={branch}
      />
      <FormLabel pt="6">Build directory</FormLabel>
      <Input
        onChange={(e) => setBuildDir(e.target.value)}
        placeholder="./"
        value={buildDir}
      />
      <FormLabel pt="6">Build command</FormLabel>
      <Input
        onChange={(e) => setBuildCmd(e.target.value)}
        placeholder="npm install"
        value={buildCmd}
      />
      <FormLabel pt="6">(Optional) deploy script</FormLabel>
      <Input
        onChange={(e) => setDeployScript(e.target.value)}
        placeholder="./deploy.js"
        value={deployScript}
      />
      <RadioGroup py="6" onChange={setBuildType} value={buildType}>
        <Radio pr="10" value="hardhat">
          Hardhat
        </Radio>
        <Radio value="truffle">Truffle</Radio>
      </RadioGroup>
      {buildType === "truffle" ? (
        <>
          <FormLabel>Truffle config file</FormLabel>
          <Input placeholder="./truffle-config.js" />
        </>
      ) : null}
      {isDeploying !== 2 ? (
        <Button
          isLoading={loading}
          isDisabled={loading}
          onClick={saveRepoFormAndDeploy}
        >
          Save and Deploy
        </Button>
      ) : (
        <>
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
