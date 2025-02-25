import {
  Button,
  Stack,
  Radio,
  RadioGroup,
  Select,
  Flex,
  Text,
  Textarea,
  Input,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Heading,
  ModalBody,
  ModalFooter,
  CheckboxGroup,
  Checkbox,
  HStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

import PropTypes from "prop-types";
import useUserStore from "../helper/useUserStore";
import { TbCheck, TbFile } from "react-icons/tb";

CreateBatchQuestion.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default function CreateBatchQuestion({ isOpen, onClose }) {
  const { fullname, user_assigned_subject, usertype } = useUserStore(
    (state) => state.user
  );
  const [Subjects, SetSubjects] = useState([]);
  const [SelectedSubject, SetSelectedSubject] = useState([])

  const toast = useToast();

  // const data = {
  //   question: Question,
  //   options: MultipleChoices,
  //   answer: MultipleChoices.filter((item) => item.is_correct === true),
  //   category: SelectedOption,
  //   created_by: fullname,
  //   terms: SelectedTerms,
  //   subject: SelectedSubject,
  // };

  const HandleCreate = () => {
    // axios
    //   .post("http://localhost/exam-bank/api/QuestionRoute.php?action=create", data)
    //   .then((response) => {
    //     if (response.data) {
    //       console.log(response.data);

    //       toast({
    //         title: "Question Created!",
    //         description: `Question: ${Question} successfully created`,
    //         status: "success",
    //         duration: 3000,
    //         isClosable: true,
    //       });

    //       onClose();
    //     } else {
    //       console.log(response.data);
    //     }
    //   });
  };

  useEffect(() => {
    if (user_assigned_subject === "none") {
      axios
        .get("http://localhost/exam-bank/api/SubjectRoute.php", {
          params: { action: "GetAllSubjects", type: usertype },
        })
        .then((response) => {
          SetSubjects(response.data);
          SetSelectedSubject(user_assigned_subject === "none" ? response.data[0].name : user_assigned_subject)
        })
        .catch((error) => {
          console.error("Error fetching subjects:", error);
        });
    }
  }, []);

  const handleChangeSelectedSubject = (e) => {
    const subject = e.target.value;
    SetSelectedSubject(subject)
  }

  const RenderSubject = () => {
    return usertype !== "Instructor" ? (
      <Select value={SelectedSubject} onChange={handleChangeSelectedSubject} mb={4}>
        {Subjects.map((subject, index) => (
            <option key={index} value={subject.name}>
              {subject.name}
            </option>
        ))}
      </Select>
    ) : (
      <Input value={user_assigned_subject} readOnly mb={4} />
    );
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay>
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>
            <Heading size="md">Upload CSV/EXCEL</Heading>
          </ModalHeader>
          <ModalBody>
            <Stack>
              <Text fontWeight="semibold">SUBJECT</Text>
              {RenderSubject()}
              <Text fontWeight="semibold">SELECT FILE TO UPLOAD</Text>
              <Input type="file" accept=".csv, .xlsx" />
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              leftIcon={<TbFile />}
              mr={2}
            >
              Download Template
            </Button>
            <Button
              colorScheme="green"
              leftIcon={<TbCheck />}
              onClick={HandleCreate}
            >
              Upload File
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
}
