import { gql, useMutation } from "@apollo/client";
import { Button } from "@chakra-ui/react";

const CREATE_PROJECT = gql`
  mutation CreateProject {
    createProject {
      id
    }
  }
`;

interface CreateProjectProps {
  onComplete: (id: string) => void;
}

function CreateProject({ onComplete }: CreateProjectProps) {
  const [createProject, { loading, error }] = useMutation(CREATE_PROJECT);
  return (
    <>
      <Button
        onClick={async () => {
          const resp = await createProject();
          onComplete(resp.data?.createProject?.id);
        }}
      >
        Create Project
      </Button>
    </>
  );
}

export default CreateProject;
