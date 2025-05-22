import { useState } from "react";
import useUserStore from "../helper/useUserStore";
import { Button, Flex, Tooltip, IconButton, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { TbCheck, TbDownload, TbEdit } from "react-icons/tb";
import QuestionCardStack from "./composites/QuestionCardStack";

export default function ExamDetail({ editExam, refreshData, selectedExam, isOpen, onClose }) {
  const user = useUserStore((state) => state.user);
  const toast = useToast();
  const [AccessCode, SetAccessCode] = useState("")
  const [DLink, SetLink] = useState("")

  const HandleEdit = () => {
    editExam()
  };

  const handleExport = () => {
    axios.post(
      `${import.meta.env.VITE_API_HOST}ExamRoute.php?action=export`,
      {
        usertype: user.usertype,
        department: JSON.parse(user.user_assigned_department)[0],
        name: selectedExam.created_by,
        test_name: selectedExam.exam_name,
        type: "EXAM",
        data: JSON.parse(selectedExam.questions),
        subject: selectedExam.subject,
      },
      {
        responseType: 'blob', // important for file download
      }
    )
    .then((response) => {
      const blob = new Blob([response.data], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedExam.exam_name}_export.txt`; // Customize the filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    })
    .catch((error) => {
      console.error('Export failed:', error);
    });
  }

  const HandleExportToBlackboard = () => {
    if (AccessCode === selectedExam.access_code) {
      toast({
        title: 'Access Granted',
        description: "Click the download button to download file",
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      axios.post(`${import.meta.env.VITE_API_HOST}ExamRoute.php?action=export`, { data: JSON.parse(selectedExam.questions), subject: selectedExam.subject })
        .then(response => {
          SetLink(response.data)
        });
    } else {
      toast({
        title: 'Error Access Code',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  return (
    <Modal
      onClose={onClose}
      isOpen={isOpen}
      scrollBehavior="outside"
      size="xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        {selectedExam === null ? (
          <>
            <ModalHeader>No Selected Exam</ModalHeader>
          </>
        ) : (
          <>
            <ModalHeader>
              <Heading size="lg">{selectedExam.exam_name}</Heading>
            </ModalHeader>
            <ModalBody>
              {DLink ?
                <Stack spacing={4}>
                  {JSON.parse(selectedExam.questions).map((question, index) => (
                    <Stack key={index}>
                      <Text fontWeight="semibold">
                        {index + 1}. {question.question}
                      </Text>
                      <QuestionCardStack options={question.options} category={question.category} />
                    </Stack>
                  ))}
                </Stack> :
                <Text>You need to enter the correct Access Code to view this exam.</Text>
              }
            </ModalBody>
          </>
        )}
        <ModalFooter>
          <Flex direction="row" justifyContent="space-between" gap={2}>
            {!DLink && 
              <Input
                value={AccessCode}
                onChange={(e) => SetAccessCode(e.currentTarget.value)}
                type="password"
                placeholder="Access Code"
              ></Input>
            }
            {DLink ? (
              <Tooltip label="Download File" hasArrow>
                <IconButton
                  icon={<TbDownload />}
                  aria-label="Download File"
                  onClick={handleExport}
                />
              </Tooltip>
            ) : (
              <Tooltip label="Export to Blackboard" hasArrow>
                <IconButton
                  colorScheme="blue"
                  icon={<TbCheck />}
                  aria-label="Export to Blackboard"
                  onClick={HandleExportToBlackboard}
                />
              </Tooltip>
            )}
            {user.usertype !== "Instructor" && DLink && (
              <Tooltip label="Edit Exam" hasArrow>
                <IconButton
                  colorScheme="yellow"
                  icon={<TbEdit />}
                  aria-label="Export to Blackboard"
                  onClick={HandleEdit}
                />
              </Tooltip>
            )}
            <Button onClick={onClose}>Close</Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}