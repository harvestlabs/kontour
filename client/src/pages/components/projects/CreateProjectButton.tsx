import { gql, useMutation } from "@apollo/client";
import { Button } from "@chakra-ui/react";
import { useAppSelector } from "@redux/hooks";
import { selectUserId } from "@redux/slices/userSlice";

const CREATE_PROJECT = gql`
  mutation CreateProjectButton {
    createProject {
      id
    }
  }
`;

interface CreateProjectButtonProps {
  onComplete: (id: string) => void;
}

function CreateProjectButton({ onComplete }: CreateProjectButtonProps) {
  const [createProject, { loading, error }] = useMutation(CREATE_PROJECT);
  const user_id = useAppSelector(selectUserId);
  return user_id ? (
    <Button
      isLoading={loading}
      isDisabled={loading}
      onClick={async () => {
        const resp = await createProject();
        onComplete(resp.data?.createProject?.id);
      }}
    >
      New Project
    </Button>
  ) : null;
}

export default CreateProjectButton;
