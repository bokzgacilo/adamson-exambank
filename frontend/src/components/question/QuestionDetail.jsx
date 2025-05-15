
import axios from "axios";
import {
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import Swal from "sweetalert2"
import { Button } from "@chakra-ui/react";
import { TbCheck, TbPencil, TbTrash, TbX } from "react-icons/tb";
import useUserStore from "../../helper/useUserStore";
import { ref, set } from "firebase/database";
import { database } from "../../helper/Firebase";

import EditQuestionModal from "./EditQuestionModal";
import QuestionDetailModal from "./QuestionDetailModal";
import { useState } from "react";

export default function QuestionDetail({ refreshTable, isOpen, onClose, updatedQuestionData, setUpdatedQuestionData, setSelectedQuestion, selectedQuestion, isEditing, setIsEditing }) {
  const { user } = useUserStore()
  const toast = useToast();
  // for tracking validation of inputs
  const [questionError, setQuestionError] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [choicesError, setChoicesError] = useState(false);
  const [multipleChoiceError, setMultipleChoiceError] = useState(false);

  const handleCloseQuestion = () => {
    setSelectedQuestion([]);
    setIsEditing(false);
    onClose();
  };

  const HandleSaveEdit = () => {
    console.log(updatedQuestionData)
    const isQuestionEmpty = updatedQuestionData.question.trim() === "";
    const isTermsEmpty = updatedQuestionData.terms.length === 0;
    const hasValidOption = updatedQuestionData.options.some(choice => choice.option.trim() !== "");
    const hasCorrectAnswer = updatedQuestionData.options.some(choice => choice.is_correct);
    const allChoicesHaveValue = updatedQuestionData.options.every(choice => choice.option.trim() !== "");

    setQuestionError(isQuestionEmpty);
    if (isQuestionEmpty) return;

    setTermsError(isTermsEmpty);
    if (isTermsEmpty) return;

    const hasChoiceErrors = !hasValidOption || !hasCorrectAnswer;
    setChoicesError(hasChoiceErrors);
    if (hasChoiceErrors) return;

    setMultipleChoiceError(!allChoicesHaveValue);
    if (!allChoicesHaveValue) return;

    axios
      .post(
        `${import.meta.env.VITE_API_HOST}QuestionRoute.php?action=update`,
        updatedQuestionData
      )
      .then((response) => {
        toast({
          title: "Question Updated!",
          description: `Question ${updatedQuestionData.id} updated`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        refreshTable()
        set(ref(database, `logs/${Date.now()}`), { action: "Question Updated", timestamp: Date.now(), target: selectedQuestion.question, actor: user.fullname });
        onClose();
      });
  };

  const HandleEnable = () => {
    axios
      .post(`${import.meta.env.VITE_API_HOST}QuestionRoute.php?action=enable`, {
        id: selectedQuestion.id,
      })
      .then((response) => {
        if (response.data) {
          toast({
            title: "Question Enabled!",
            description: `Question ${selectedQuestion.id} enabled`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          // FIREBASE ENABLE QUESTION
          onClose();
        }
      });
  };

  const HandleDisable = () => {
    axios
      .post(`${import.meta.env.VITE_API_HOST}QuestionRoute.php?action=disable`, {
        id: selectedQuestion.id,
      })
      .then((response) => {
        if (response.data) {
          toast({
            title: "Question Disabled!",
            description: `Question ${selectedQuestion.id} disabled`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          onClose();
        }
      });
  };

  const HandleToggleEdit = () => {
    setIsEditing(true);
  };

  const HandleDelete = () => {
    onClose();

    Swal.fire({
      title: 'Are you sure?',
      text: `Do you really want to delete: "${selectedQuestion.question}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e53e3e',
      cancelButtonColor: '#a0aec0',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(`${import.meta.env.VITE_API_HOST}QuestionRoute.php?action=delete`, {
            id: selectedQuestion.id,
          })
          .then((response) => {
            if (response.data) {
              toast({
                title: "Question Deleted!",
                description: `Question "${selectedQuestion.question}" has been deleted.`,
                status: "success",
                duration: 3000,
                isClosable: true,
              });

              set(ref(database, `logs/${Date.now()}`), {
                action: "Question Deleted",
                timestamp: Date.now(),
                target: selectedQuestion.question,
                actor: user.fullname,
              });
              refreshTable()
              onClose();
            }
          });
      }
    });
  };


  return (
    <Modal size="xl" isOpen={isOpen} onClose={handleCloseQuestion}>
      <ModalOverlay />
      <ModalCloseButton />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>
          <Heading size="lg">
            {!isEditing ? "Question" : "Editing Question"}
          </Heading>
        </ModalHeader>
        <ModalBody>
          {!isEditing ? (
            <QuestionDetailModal QuestionData={selectedQuestion} />
          ) : (
            <EditQuestionModal
              SetUpdatedQuestionData={setUpdatedQuestionData}
              QuestionData={selectedQuestion}
              choicesError={choicesError}
              questionError={questionError}
              termsError={termsError}
            />
          )}
        </ModalBody>
        <ModalFooter>
          {(user.fullname === selectedQuestion?.created_by ||
            user.usertype === "Coordinator" || user.usertype === "Admin") && (
              <Button
                leftIcon={!isEditing ? <TbPencil /> : <TbCheck />}
                colorScheme={!isEditing ? "blue" : "green"}
                onClick={!isEditing ? HandleToggleEdit : HandleSaveEdit}
              >
                {!isEditing ? "Edit" : "Save Changes"}
              </Button>
            )}

          {!isEditing && (user.fullname === selectedQuestion?.created_by ||
            user.usertype === "Coordinator" || user.usertype === "Admin") && (
              <>
                {selectedQuestion?.status == null ? (
                  ""
                ) : selectedQuestion.status !== 1 ? (
                  <Button
                    leftIcon={<TbCheck />}
                    colorScheme="green"
                    onClick={HandleEnable}
                    ml={4}
                    mr={4}
                  >
                    Activate
                  </Button>
                ) : (
                  <Button
                    leftIcon={<TbX />}
                    colorScheme="gray"
                    onClick={HandleDisable}
                    ml={4}
                    mr={4}
                  >
                    Deactivate
                  </Button>
                )}

                <Button onClick={HandleDelete} colorScheme="red" leftIcon={<TbTrash />}>Delete</Button>
              </>
            )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}