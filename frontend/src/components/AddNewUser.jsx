import {
  Button,
  Stack,
  Select,
  Text,
  Input,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

import PropTypes from "prop-types";
AddNewUserForm.propTypes = {
  isOpen: PropTypes.bool.isRequired, 
  onClose: PropTypes.func.isRequired
};

export default function AddNewUserForm({isOpen, onClose}) {
  const [FullName, SetFullName] = useState("");
  const [Role, SetRole] = useState("Instructor");
  const [AssignedSubject, SetAssignedSubject] = useState("Math");
  const [Username, SetUsername] = useState("")
  const [Password, SetPassword] = useState("")
  const toast = useToast();

  const data = {
    name: FullName,
    role: Role,
    assigned_subject: AssignedSubject,
    username: Username,
    password: Password,
  }

  const HandleAddUser = () => {
    axios.post('http://localhost:8080/api/UserRoute.php?action=create', data)
      .then(response => {
        console.log(response.data)

        toast({
          title: "User Created!",
          description: response.data.message,
          status: 'success',
          duration: 3000,
          isClosable: true,
        })

        onClose()
      })
  }

  return (
    <AlertDialog isOpen={isOpen} motionPreset="slideInBottom" onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Add User
          </AlertDialogHeader>
          <AlertDialogBody>
            <Stack spacing={2}>
              <Text fontWeight="semibold">Fullname</Text>
              <Input value={FullName} onChange={(e) => SetFullName(e.currentTarget.value)} type="text" mb={4} />
              <Text fontWeight="semibold">Role</Text>
              <Select value={Role} onChange={(e) => SetRole(e.target.value)} mb={4}>
                <option>Instructor</option>
                <option>Coordinator</option>
              </Select>

              <Text fontWeight="semibold">Assign Subject</Text>
              <Select value={AssignedSubject} onChange={(e) => SetAssignedSubject(e.target.value)} mb={4}>
                <option>Science</option>
                <option>Math</option>
                <option>Filipino</option>
              </Select>
              <Text fontWeight="semibold">Set Username</Text>
              <Input value={Username} onChange={(e) => SetUsername(e.currentTarget.value)} type="text" mb={4} />
              <Text fontWeight="semibold">Set Password</Text>
              <Input value={Password} onChange={(e) => SetPassword(e.currentTarget.value)} type="text" mb={4} />
            </Stack>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              colorScheme="green"
              onClick={HandleAddUser}
            >
              Create
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
