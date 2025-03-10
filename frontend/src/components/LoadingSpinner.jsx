import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogOverlay, Spinner } from "@chakra-ui/react";

export default function LoadingSpinner() {
    return (
        <AlertDialog isOpen={true} isCentered>
            <AlertDialogOverlay />
            <AlertDialogContent bg="transparent" boxShadow="none">
                <AlertDialogBody display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
                </AlertDialogBody>
            </AlertDialogContent>
        </AlertDialog>
    )
}