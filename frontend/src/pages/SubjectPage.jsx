import { Button, Heading, Stack, Flex, useDisclosure, Card, CardHeader, CardBody, Divider, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Text, ModalFooter, Input } from "@chakra-ui/react";
import axios from 'axios';
import { useEffect, useState } from "react";
import { BiPlus } from "react-icons/bi";
import SubjectDataTable from "../components/SubjectDataTable";
import { TbCheck } from "react-icons/tb";

export default function SubjectPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [Subjects, SetSubjects] = useState([])
  
  useEffect(() => {
    axios.get(`http://localhost/exam-bank/api/SubjectRoute.php?action=viewAll`)
      .then(response => {
        SetSubjects(response.data);
      });
  }, []);

  return (
    <Stack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay>
          <ModalContent>
            <ModalCloseButton />
            <ModalHeader>
              <Heading size="lg">New Subject</Heading>
            </ModalHeader>
            <ModalBody>
              <Stack>
                <Text fontWeight="semibold">SUBJECT NAME</Text>
                <Input type="text" placeholder="Subject Name" />
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button leftIcon={<TbCheck />} colorScheme="green">Create</Button>
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
                <Button leftIcon={<BiPlus />} colorScheme="green" onClick={onOpen}>New Subject</Button>
              </Flex>
            </Flex>
          </CardHeader>
          <Divider />
          <CardBody p={4}>
            <SubjectDataTable data={Subjects}/>
          </CardBody>
        </Card>
      </Stack>
    </Stack>
  );
}
