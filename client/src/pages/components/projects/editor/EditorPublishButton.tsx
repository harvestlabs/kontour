import React from "react";
import {
  Text,
  FormLabel,
  Button,
  Input,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
} from "@chakra-ui/react";

type Props = {};

export default function EditorPublishButton({
  children,
}: React.PropsWithChildren<Props>) {
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  return (
    <>
      <Button
        size="lg"
        position="fixed"
        bottom="24px"
        right="24px"
        onClick={() => setIsOpen(true)}
      >
        Publish
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Publish Version
          </AlertDialogHeader>

          <AlertDialogBody>
            <Text>
              Are you sure? Once you publish a version, it can no longer be
              modified.
            </Text>
            <FormLabel>Name your version:</FormLabel>
            <Input />
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button variant="reject" onClick={onClose} ml={3}>
              Publish
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
