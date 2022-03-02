import { gql, useMutation } from "@apollo/client";
import { Button } from "@chakra-ui/react";

const CREATE_PROJECT = gql`
  mutation CreateProject {
    createProject {
      id
    }
  }
`;

function CreateProject() {
  const [createProject, { loading, error }] = useMutation(CREATE_PROJECT);
  return (
    <>
      <Button onClick={() => createProject()}> Create Project</Button>
    </>
  );
}

export default CreateProject;
