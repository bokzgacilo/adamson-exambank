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
  Flex,
  Icon,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { TbPlus, TbX } from "react-icons/tb";

AddNewUserForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  fetchMasterData: PropTypes.func.isRequired,
};

export default function AddNewUserForm({ isOpen, onClose, fetchMasterData }) {
  const [FullName, SetFullName] = useState("");
  const [Role, SetRole] = useState("Instructor");
  const [Username, SetUsername] = useState("");
  const [Password, SetPassword] = useState("");
  const [AvailableSubjects, SetAvailableSubjects] = useState([]);
  const [SelectedSubject, SetSelectedSubject] = useState(AvailableSubjects[0]);
  const [UserSubjects, SetUserSubjects] = useState([]);
  const toast = useToast();

  const data = {
    name: FullName,
    role: Role,
    assigned_subject: UserSubjects,
    username: Username,
    password: Password,
  };

  useEffect(() => {
    if (Role === "Coordinator") {
      SetUserSubjects(["None"]);
    } else {
      axios
        .get(`${import.meta.env.VITE_API_HOST}SubjectRoute.php?action=viewAll`)
        .then((response) => {
          SetAvailableSubjects(response.data);
          SetSelectedSubject(response.data[0]?.name || "");
          SetUserSubjects([])
        })
        .catch((error) => console.error("Error fetching subjects:", error));
    }
  }, [Role]);

  const HandleAddSubject = () => {
    if (SelectedSubject && !UserSubjects.includes(SelectedSubject)) {
      SetUserSubjects((prev) => [...prev, SelectedSubject]);
    }
  };

  const HandleRemoveSubject = (indexToRemove) => {
    SetUserSubjects((prev) => prev.filter((_, index) => index !== indexToRemove));
  };
  
  const HandleAddUser = () => {
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
          <ModalHeader fontSize="lg" fontWeight="bold">
            NEW USER
          </ModalHeader>
          <ModalBody>
            <Stack spacing={2}>
              <Text fontWeight="semibold">FULL NAME</Text>
              <Input
                size="sm"
                value={FullName}
                onChange={(e) => SetFullName(e.currentTarget.value)}
                type="text"
                mb={4}
              />
              <Text fontWeight="semibold">ROLE</Text>
              <Select
                size="sm"
                value={Role}
                onChange={(e) => SetRole(e.target.value)}
                mb={4}
              >
                <option>Instructor</option>
                <option>Coordinator</option>
              </Select>
              {Role === "Coordinator" ? (
                ""
              ) : (
                <>
                  <Text fontWeight="semibold">SUBJECT</Text>
                  <Flex direction="row" gap={4}>
                    <Select
                      size="sm"
                      value={SelectedSubject}
                      onChange={(e) => SetSelectedSubject(e.target.value)}
                      mb={4}
                    >
                      {AvailableSubjects.map((subject) => (
                        <option key={subject.id} value={subject.name}>
                          {subject.name}
                        </option>
                      ))}
                    </Select>
                    <Button
                      colorScheme="green"
                      size="sm"
                      onClick={HandleAddSubject}
                    >
                      <Icon as={TbPlus} />
                    </Button>
                  </Flex>
                  {UserSubjects.length === 0 ? (
                    <Text>No Selected Subject</Text>
                  ) : (
                    <Stack mb={4}>
                      {UserSubjects.map((item, index) => (
                        <Flex key={index} direction="row" alignItems="center" justifyContent="space-between">
                        <Text >
                          {index + 1}. {item}
                        </Text>
                        <Button onClick={() => HandleRemoveSubject(index)} size="xs"><Icon as={TbX} /></Button>
                        </Flex>
                        
                      ))}
                    </Stack>
                  )}
                </>
              )}

              <Text fontWeight="semibold">SET EMAIL</Text>
              <Input
                size="sm"
                value={Username}
                onChange={(e) => SetUsername(e.currentTarget.value)}
                type="email"
              />
              {Username && !/^[a-zA-Z0-9._%+-]+@adamson\.edu\.ph$/.test(Username) && (
                <Text fontSize="xs" mb={4} color="red.500">
                  Please use an Adamson associated email (e.g., user@adamson.edu.ph)
                </Text>
              )}
              <Text fontWeight="semibold">SET PASSWORD</Text>
              <Input
                size="sm"
                value={Password}
                onChange={(e) => SetPassword(e.currentTarget.value)}
                type="text"
                mb={4}
              />
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="green"
              onClick={HandleAddUser}
              size="sm"
              rightIcon={<TbPlus />}
              disabled={UserSubjects.length === 0 ? true : false}
            >
              ADD USER
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
}
