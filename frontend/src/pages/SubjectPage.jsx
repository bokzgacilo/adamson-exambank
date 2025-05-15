import { Button, Heading, Stack, Flex, useDisclosure, Card, CardHeader, CardBody, Divider, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Text, ModalFooter, Input } from "@chakra-ui/react";
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
      fetchSubjects()
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
              <Heading size="md">CREATE SUBJECT</Heading>
            </ModalHeader>
            <ModalBody>
              <Stack>
                <Text fontWeight="semibold">SUBJECT NAME</Text>
                <Input size="sm" value={SubjectName} onChange={(e) => SetSubjectName(e.currentTarget.value)} type="text" placeholder="Subject Name" />
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button disabled={SubjectName === "" ? true : false} leftIcon={<TbCheck />} size="sm" colorScheme="green" onClick={HandleCreateSubject}>Create</Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>
      <Stack p={4}>
        <Card>
          <CardHeader backgroundColor="#2b2b2b" color="#fff">
            <Flex direction="row" alignItems="center" justifyContent="space-between">
              <Heading size="md">SUBJECTS LIST</Heading>
              <Flex direction="row" gap={2}>
                <Button leftIcon={<BiPlus />} colorScheme="green" onClick={onOpen} size="sm">New Subject</Button>
              </Flex>
            </Flex>
          </CardHeader>
          <Divider />
          <CardBody p={4}>
            <SubjectDataTable fetchSubjects={fetchSubjects} data={Subjects} />
          </CardBody>
        </Card>
      </Stack>
    </Stack>
  );
}
