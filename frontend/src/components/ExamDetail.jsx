import { useState } from "react";
import useUserStore from "../helper/useUserStore";
import { Button, Flex, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, RadioGroup, Stack, Text, Textarea, useToast } from "@chakra-ui/react";
import axios from "axios";
import { ref, set } from "firebase/database";
import { database } from "../helper/Firebase";
import PropTypes from "prop-types";

ExamDetail.propTypes = {
  selectedExam: PropTypes.array.isRequired,
  refreshData: PropTypes.func.isRequired,
  editExam: PropTypes.func.isRequired,
  isOpen: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};


export default function ExamDetail ({ editExam, refreshData, selectedExam, isOpen, onClose }){
  const user = useUserStore((state) => state.user);
  const toast = useToast();
  const [AccessCode, SetAccessCode] = useState("")
  const [DLink, SetLink] = useState("")

  const renderFormElement = (options, category) => {
    switch (category) {
      case "Identification": {
        return (
          <Input size="sm" value={JSON.parse(options)[0].option} readOnly />
        );
      }
      case "Enumeration": {
        const TextAreaValue = JSON.parse(options)
          .map((item) => item.option)
          .join("\n");

        return (
          <Textarea
            size="sm"
            value={TextAreaValue}
            placeholder="Enter answers"
            isReadOnly={true}
          />
        );
      }
      case "True/False": {
        return (
          <RadioGroup>
            <Stack spacing={2}>
              {JSON.parse(options).map((option) => (
                <Radio key={option.id} isChecked={option.is_correct}>
                  {option.option}
                </Radio>
              ))}
            </Stack>
          </RadioGroup>
        );
      }

      case "Multiple":
        return (
          <RadioGroup>
            <Stack spacing={4}>
              {JSON.parse(options).map((option) => (
                <Flex
                  key={option.id}
                  direction="row"
                  alignItems="center"
                  gap={4}
                >
                  <Radio isChecked={option.is_correct} />
                  <Input size="sm" type="text" value={option.option} readOnly />
                </Flex>
              ))}
            </Stack>
          </RadioGroup>
        );
      default:
        return null;
    }
  };

  const HandleEdit = () => {
    editExam()
  };

  const HandleDelete = () => {
    axios
      .post("http://localhost/exam-bank/api/ExamRoute.php?action=delete", {
        id: selectedExam.id,
      })
      .then((response) => {
        console.log(response);

        if (response.data) {
          toast({
            title: "Exam Deleted!",
            description: `${selectedExam.exam_name} deleted`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });

          set(ref(database, `logs/${Date.now()}`), {
            action: "Exam Deleted",
            timestamp: Date.now(),
            target: selectedExam.exam_name,
            actor: user.fullname,
          });
          
          onClose();

          refreshData()
        }
      });
  };

  const HandleExportToBlackboard = () => {
    if (AccessCode === selectedExam.access_code) {
      toast({
        title: 'Access Granted',
        description: "Click the download button to download file",
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      axios.post(`http://localhost/exam-bank/api/ExamRoute.php?action=export`, { data: JSON.parse(selectedExam.questions), subject: selectedExam.subject })
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
            <ModalHeader>{selectedExam.exam_name}</ModalHeader>
            <ModalBody>
              <Stack spacing={4}>
                {JSON.parse(selectedExam.questions).map((question, index) => (
                  <Stack key={question.id}>
                    <Text fontWeight="semibold">
                      {index + 1}. {question.question}
                    </Text>
                    {renderFormElement(question.options, question.category)}
                  </Stack>
                ))}
              </Stack>
            </ModalBody>
          </>
        )}
        <ModalFooter>
          <Flex direction="row" justifyContent="space-between" gap={2}>
            <Input
              value={AccessCode}
              onChange={(e) => SetAccessCode(e.currentTarget.value)}
              type="text"
              size="sm"
              placeholder="Access Code"
            ></Input>
            {DLink !== "" ? (
              <Button
              size="sm"
                onClick={() =>
                  window.open(
                    `http://localhost/exam-bank/api/${DLink}`,
                    "_blank"
                  )
                }
              >
                Download
              </Button>
            ) : (
              <Button size="sm" colorScheme="blue" onClick={HandleExportToBlackboard}>
                Export
              </Button>
            )}
            {user.usertype !== "Instructor" && (
              <Button size="sm" colorScheme="yellow" onClick={HandleEdit}>
                Edit
              </Button>
            )}
            <Button size="sm" onClick={onClose}>Close</Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}