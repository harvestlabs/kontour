import {
  Text,
  Button,
  Flex,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  FormLabel,
  Input,
  AlertDialogFooter,
} from "@chakra-ui/react";

type Props = {
  cons: ContractSourceConstructor;
  contractName: string;
  isOpen: boolean;
  cancelRef: any;
  onClose: () => void;
  onDeploy: (args: any[]) => void;
};
export default function VersionContractDeployModal({
  cons,
  contractName,
  isOpen,
  cancelRef,
  onClose,
  onDeploy,
}: Props) {
  const args = Array.from(Array(cons?.inputs.length));

  const inputs = cons?.inputs.map((i, idx) => {
    return (
      <>
        <FormLabel>
          {i.name}: {i.type}
        </FormLabel>
        <Input
          placeholder={i.type}
          onChange={(e) => (args[idx] = e.target.value)}
        />
      </>
    );
  });

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader fontSize="lg" fontWeight="bold">
          Deploy {contractName}
        </AlertDialogHeader>
        <AlertDialogBody>{inputs}</AlertDialogBody>

        <AlertDialogFooter>
          <Button ref={cancelRef} onClick={onClose}>
            Cancel
          </Button>
          <Button variant="success" onClick={() => onDeploy(args)} ml={3}>
            Publish
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
