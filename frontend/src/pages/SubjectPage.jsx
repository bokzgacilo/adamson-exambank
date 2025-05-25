import { Button, Heading, Stack, Flex, useDisclosure, Card, CardHeader, CardBody, Divider, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Text, ModalFooter, Input, FormControl, FormLabel } from "@chakra-ui/react";
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter
} from '@chakra-ui/react'
import axios from 'axios';
import { useState } from "react";
import SubjectDataTable from "../components/SubjectDataTable";
import { TbCheck, TbPlus } from "react-icons/tb";
import Swal from "sweetalert2"

export default function SubjectPage() {
  const {isOpen: alertIsOpen, onOpen: alertOnOpen, onClose: alertOnClose} = useDisclosure();
  const {isOpen, onOpen, onClose} = useDisclosure();

  const [isEditing, setIsEditing] = useState(false)
  const [targetSubject, setTargetSubject] = useState(0)
  const [Subjects, SetSubjects] = useState([])
  const [SubjectName, SetSubjectName] = useState("")
  const [loading, setLoading] = useState(false)

  const fetchSubjects = async () => {
    await axios.get(`${import.meta.env.VITE_API_HOST}SubjectRoute.php?action=viewAll`)
      .then(response => {
        SetSubjects(response.data)
      });
  };

  const modalClose = () => {
    SetSubjectName("")
    setIsEditing(false)
    onClose();
  }

  const HandleCreateSubject = () => {
    setLoading(true)
    isEditing && alertOnClose()

    let url = isEditing ? `${import.meta.env.VITE_API_HOST}SubjectRoute.php?action=update` : `${import.meta.env.VITE_API_HOST}SubjectRoute.php?action=create`
    let data = isEditing ? {
      id: targetSubject,
      subject_name: SubjectName
    } : {
      subject_name: SubjectName
    }

    axios
      .post(url, data)
      .then((response) => {
        console.log(response)

        if(isEditing){
          Swal.fire("Updated!", "Subject Updated", "success");
        }else {
          Swal.fire("Added!", "Subject Added", "success");
        }
        onClose();
        SetSubjectName("")
        setLoading(false)
        fetchSubjects()
      });
  }

  const prepareEdit = () => {
    alertOnOpen()
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={modalClose} isEditing={isEditing}>
        <ModalOverlay>
          <ModalContent>
            <ModalCloseButton />
            <ModalHeader>
              <Heading size="lg">{isEditing ? "Edit Subject" : "Create New Subject"}</Heading>
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
              <Button mr={4} onClick={modalClose}>Close</Button>
              <Button isLoading={loading} disabled={SubjectName === "" || loading} leftIcon={<TbCheck />} colorScheme="green" onClick={isEditing ? prepareEdit : HandleCreateSubject}>{isEditing ? "Save Changes" : "Create New Subject"}</Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>

      <AlertDialog
        isOpen={alertIsOpen}
        onClose={alertOnClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Editing?
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to save change?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={alertOnClose}>
                Cancel
              </Button>
              <Button colorScheme="green" onClick={HandleCreateSubject} ml={4}>
                Yes, Save Changes
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Stack p={0}>
        <Card height="100dvh">
          <CardHeader backgroundColor="#141414" color="#fff">
            <Flex direction="row" alignItems="center" justifyContent="space-between">
              <Heading>Manage Subjects</Heading>
              <Flex direction="row" gap={2}>
                <Button leftIcon={<TbPlus />} colorScheme="green" onClick={onOpen}>New Subject</Button>
              </Flex>
            </Flex>
          </CardHeader>
          <Divider />
          <CardBody p={0}>
            <SubjectDataTable 
              setTargetSubject={setTargetSubject}
              fetchSubjects={fetchSubjects} 
              data={Subjects} 
              setIsEditing={setIsEditing}
              modalOpen={onOpen}
              SetSubjectName={SetSubjectName}
            />
          </CardBody>
        </Card>
      </Stack>
    </>
  );
}