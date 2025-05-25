import {
  Button,
  Stack,
  Select,
  Text,
  Input,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Heading,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { TbPlus } from "react-icons/tb";
import AssignSubjectSelector from "./composites/AssignSubjectSelector";
import AssignDepartmentSelector from "./composites/AssignDepartmentSelector";

export default function AddNewUserForm({ isOpen, onClose, fetchMasterData }) {
  const [FullName, SetFullName] = useState("");
  const [Role, SetRole] = useState("Instructor");
  const [Username, SetUsername] = useState("");
  const [Password, SetPassword] = useState("");
  const [UserSubjects, SetUserSubjects] = useState([]);
  const [UserDepartments, SetUserDepartments] = useState([]);

  const toast = useToast();
  const data = {
    name: FullName,
    role: Role,
    assigned_subject: UserSubjects,
    assigned_department: UserDepartments,
    username: Username,
    password: "@adamson123",
  };

  const HandleAddUser = () => {
    if (!FullName || !Username || !Password) {
      toast({
        title: "Validation Error",
        description: "Full Name, Username, and Password are required.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    axios
      .post(`${import.meta.env.VITE_API_HOST}UserRoute.php?action=create`, data)
      .then((response) => {
        toast({
          title: "User Created!",
          description: response.data.message,
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        fetchMasterData()
        onClose();
      });

  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay>
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader><Heading size="lg">Add User</Heading></ModalHeader>
          <ModalBody>
            <Stack spacing={2}>
              <Text fontWeight="semibold">Full Name</Text>
              <Input
                placeholder="Juan Dela Cruz"
                value={FullName}
                onChange={(e) => SetFullName(e.currentTarget.value)}
                type="text"
              />
              <Text fontWeight="semibold">Role</Text>
              <Select
                value={Role}
                onChange={(e) => SetRole(e.target.value)}
              >
                <option>Instructor</option>
                <option>Coordinator</option>
              </Select>
              {isOpen && 
                <>
                  <AssignSubjectSelector 
                    data={{
                      user_subjects: UserSubjects,
                      set_user_subject: SetUserSubjects
                    }}
                  />
                  <AssignDepartmentSelector 
                    data={{
                      user_departments: UserDepartments,
                      set_user_department: SetUserDepartments
                    }}
                  />
                </>
                
              }
              <Text fontWeight="semibold">Username</Text>
              <Input
                value={Username}
                onChange={(e) => SetUsername(e.currentTarget.value)}
                type="email"
                placeholder="j.delacruz@adamson.edu.ph"
              />
              {Username && !/^[a-zA-Z0-9._%+-]+@adamson\.edu\.ph$/.test(Username) && (
                <Text fontSize="xs" mb={4} color="red.500">
                  Please use an Adamson associated email (e.g., user@adamson.edu.ph)
                </Text>
              )}
              {/* <Text fontWeight="semibold">Password</Text>
              <Input
                value={Password}
                placeholder="Password"
                onChange={(e) => SetPassword(e.currentTarget.value)}
                type="text"
                mb={4}
              /> */}
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              mr={4}
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              colorScheme="green"
              onClick={HandleAddUser}
              rightIcon={<TbPlus />}
              disabled={UserSubjects.length === 0 ? true : false}
            >
              Add User
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
}
