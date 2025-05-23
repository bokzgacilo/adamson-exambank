import { Button, Heading, Stack, Flex, useDisclosure, Card, CardHeader, CardBody, Divider, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Text, ModalFooter, Input, FormControl, FormLabel } from "@chakra-ui/react";
import axios from 'axios';
import { useEffect, useState } from "react";
import { BiPlus } from "react-icons/bi";
import SubjectDataTable from "../components/SubjectDataTable";
import { TbCheck } from "react-icons/tb";
import useUserStore from "../helper/useUserStore";
import { database } from "../helper/Firebase";
import { onChildAdded, ref, set } from "firebase/database";

export default function SubjectPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [Subjects, SetSubjects] = useState([])
  const [SubjectName, SetSubjectName] = useState("")
  const { user } = useUserStore();

  const fetchSubjects = async () => {
    await axios.get(`${import.meta.env.VITE_API_HOST}SubjectRoute.php?action=viewAll`)
      .then(response => {
        SetSubjects(response.data)
      });
  };

  useEffect(() => {
    fetchSubjects()
    const logRef = ref(database, "/logs");
    const unsubscribe = onChildAdded(logRef, () => {
      // fetchSubjects()
    });
    return () => unsubscribe();
  }, []);

  const HandleCreateSubject = () => {
    axios
      .post(`${import.meta.env.VITE_API_HOST}SubjectRoute.php?action=create`, {
        subject_name: SubjectName,
      })
      .then((response) => {
        if (response.data) {
          set(ref(database, `logs/${Date.now()}`), { action: "Subject Created", timestamp: Date.now(), target: SubjectName, actor: user.fullname });
          SetSubjectName("")
          onClose();
        }
      });
  }

  return (
    <Stack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay>
          <ModalContent>
            <ModalCloseButton />
            <ModalHeader>
              <Heading size="lg">Create Subject</Heading>
            </ModalHeader>
            <ModalBody>
              <Stack>
                <FormControl isRequired>
                  <FormLabel>Subject Name</FormLabel>
                  <Input value={SubjectName} onChange={(e) => SetSubjectName(e.currentTarget.value)} type="text" placeholder="Subject Name" />
                </FormControl>
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button mr={4} onClick={onClose}>Close</Button>
              <Button disabled={SubjectName === "" ? true : false} leftIcon={<TbCheck />} colorScheme="green" onClick={HandleCreateSubject}>Create</Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>
      <Stack p={0}>
        <Card height="100dvh">
          <CardHeader backgroundColor="#141414" color="#fff">
            <Flex direction="row" alignItems="center" justifyContent="space-between">
              <Heading>Manage Subjects</Heading>
              <Flex direction="row" gap={2}>
                <Button leftIcon={<BiPlus />} colorScheme="green" onClick={onOpen}>New Subject</Button>
              </Flex>
            </Flex>
          </CardHeader>
          <Divider />
          <CardBody p={0}>
            <SubjectDataTable fetchSubjects={fetchSubjects} data={Subjects} />
          </CardBody>
        </Card>
      </Stack>
    </Stack>
  );
}
