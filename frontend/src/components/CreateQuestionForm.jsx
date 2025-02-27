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
import { TbCheck } from "react-icons/tb";
import { getDatabase, ref, set } from "firebase/database";
import app from "../helper/Firebase";

CreateQuestionForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default function CreateQuestionForm({ isOpen, onClose }) {
  const { fullname, user_assigned_subject, usertype } = useUserStore(
    (state) => state.user
  );
  const [SelectedOption, SetSelectedOption] = useState("Identification");
  const [MultipleChoices, SetMultipleChoices] = useState([]);
  const [SelectedClassification, SetSelectedClassification] = useState("Knowledge")
  const [EnumerationText, SetEnumerationText] = useState("");
  const [Question, SetQuestion] = useState("");
  const [Subjects, SetSubjects] = useState([]);
  const [SelectedSubject, SetSelectedSubject] = useState(user_assigned_subject);
  const firebaseDB = getDatabase(app);
  const [SelectedTerms, SetSelectedTerms] = useState([]);
  const toast = useToast();

  const data = {
    question: Question,
    options: MultipleChoices,
    answer: MultipleChoices.filter((item) => item.is_correct === true),
    category: SelectedOption,
    created_by: fullname,
    terms: SelectedTerms,
    subject: SelectedSubject,
    classification: SelectedClassification
  };

  const HandleCreate = () => {
    axios
      .post(
        "http://localhost/exam-bank/api/QuestionRoute.php?action=create",
        data
      )
      .then((response) => {
        if (response.data) {
          console.log(response.data);

          toast({
            title: "Question Created!",
            description: `Question: ${Question} successfully created`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });

          // onClose();
          
          set(ref(firebaseDB, "logs/" + Date.now()), {
            action: "Question Added",
            timestamp: Date.now(),
            target: Question,
            actor: fullname
          })
        } else {
          console.log(response.data);
        }
      });
  };

  useEffect(() => {
    updateMultipleChoices("Identification");

    if (user_assigned_subject === "none") {
      axios
        .get("http://localhost/exam-bank/api/SubjectRoute.php", {
          params: { action: "GetAllSubjects", type: usertype },
        })
        .then((response) => {
          SetSubjects(response.data);
          SetSelectedSubject(
            user_assigned_subject === "none"
              ? response.data[0].name
              : user_assigned_subject
          );
        })
        .catch((error) => {
          console.error("Error fetching subjects:", error);
        });
    }
  }, []);

  const handleChangeSelectedSubject = (e) => {
    const subject = e.target.value;
    SetSelectedSubject(subject);
  };

  const RenderSubject = () => {
    return usertype !== "Instructor" ? (
      <Select
        value={SelectedSubject}
        onChange={handleChangeSelectedSubject}
        mb={4}
        size="sm"
      >
        {Subjects.map((subject, index) => (
          <option key={index} value={subject.name}>
            {subject.name}
          </option>
        ))}
      </Select>
    ) : (
      <Input size="sm" value={user_assigned_subject} readOnly mb={4} />
    );
  };

  const updateMultipleChoices = (type) => {
    switch (type) {
      case "Identification":
        SetMultipleChoices([{ id: 1, option: "", is_correct: true }]);
        break;
      case "True/False":
        SetMultipleChoices([
          { id: 1, option: "True", is_correct: false },
          { id: 2, option: "False", is_correct: false },
        ]);
        break;
      case "Enumeration":
        SetMultipleChoices([]);
        break;
      case "Multiple":
        SetMultipleChoices([
          { id: 1, option: "Option 1", is_correct: false },
          { id: 2, option: "Option 2", is_correct: false },
          { id: 3, option: "Option 3", is_correct: false },
          { id: 4, option: "Option 4", is_correct: false },
        ]);
        break;
      default:
        SetMultipleChoices([]);
    }
  };

  const handleChangeOption = (e) => {
    const type = e.target.value;
    SetSelectedOption(type);
    updateMultipleChoices(type);
  };

  const handleRadioChange = (selectedId) => {
    SetMultipleChoices((prev) =>
      prev.map((option) =>
        option.id === selectedId
          ? { ...option, is_correct: !option.is_correct }
          : option
      )
    );
  };

  const handleInputChange = (id, newValue) => {
    SetMultipleChoices(
      MultipleChoices.map((option) => ({
        ...option,
        option: option.id === id ? newValue : option.option,
      }))
    );
  };

  const handleCheckboxChange = (value) => {
    SetSelectedTerms((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleEnumerationChange = (e) => {
    const values = e.target.value
      .split("\n")
      .filter((val) => val.trim() !== "");
    SetEnumerationText(e.target.value);
    SetMultipleChoices(
      values.map((val, index) => ({
        id: index + 1,
        option: val,
        is_correct: true,
      }))
    );
  };

  const renderFormElement = () => {
    switch (SelectedOption) {
      case "Identification":
        return (
          <Input
            type="text"
            placeholder="Enter answer"
            onChange={(e) => handleInputChange(1, e.target.value)}
            size="sm"
          />
        );
      case "Enumeration":
        return (
          <>
            <Text>Separate answers by new line</Text>
            <Textarea
              size="sm"
              value={EnumerationText}
              onChange={handleEnumerationChange}
              placeholder="Enter answers"
            />
          </>
        );
      case "True/False":
        return (
          <RadioGroup
            onChange={(val) => handleRadioChange(val === "true" ? 1 : 2)}
          >
            <Stack spacing={2}>
              {MultipleChoices.map((option) => (
                <Radio
                  key={option.id}
                  value={option.option.toLowerCase()}
                  isChecked={option.is_correct}
                >
                  {option.option}
                </Radio>
              ))}
            </Stack>
          </RadioGroup>
        );
      case "Multiple":
        return (
          <RadioGroup>
            <Stack spacing={2}>
              {MultipleChoices.map((option) => (
                <Flex
                  key={option.id}
                  direction="row"
                  alignItems="center"
                  gap={4}
                >
                  <Checkbox
                    isChecked={option.is_correct}
                    onChange={() => handleRadioChange(option.id)}
                  />
                  <Input
                    size="sm"
                    type="text"
                    value={option.option}
                    onChange={(e) =>
                      handleInputChange(option.id, e.target.value)
                    }
                  />
                </Flex>
              ))}
            </Stack>
          </RadioGroup>
        );
      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay>
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>
            <Heading size="md">CREATE QUESTION</Heading>
          </ModalHeader>
          <ModalBody>
            <Stack>
              <Text fontWeight="semibold">SUBJECT</Text>
              {RenderSubject()}
              <Text fontWeight="semibold">QUESTION</Text>
              <Input
                size="sm"
                type="text"
                mb={4}
                value={Question}
                placeholder="Enter question"
                onChange={(e) => SetQuestion(e.currentTarget.value)}
              />
              <Text fontWeight="semibold">TERMS</Text>
              <CheckboxGroup colorScheme="blue">
                <HStack justifyContent="space-evenly" mb={4}>
                  <Checkbox
                    isChecked={SelectedTerms.includes("Prelims")}
                    onChange={() => handleCheckboxChange("Prelims")}
                  >
                    Prelims
                  </Checkbox>
                  <Checkbox
                    isChecked={SelectedTerms.includes("Midterms")}
                    onChange={() => handleCheckboxChange("Midterms")}
                  >
                    Midterms
                  </Checkbox>
                  <Checkbox
                    isChecked={SelectedTerms.includes("Finals")}
                    onChange={() => handleCheckboxChange("Finals")}
                  >
                    Finals
                  </Checkbox>
                </HStack>
              </CheckboxGroup>
              <Text fontWeight="semibold">CLASSIFICATION</Text>
              <Select
                size="sm"
                value={SelectedClassification}
                onChange={(e) => SetSelectedClassification(e.target.value)}
                mb={4}
              >
                <option value="Knowledge">Knowledge</option>
                <option value="Comprehension">Comprehension</option>
                <option value="Application">Application</option>
                <option value="Analysis">Analysis</option>
                <option value="Synthesis">Synthesis</option>
                <option value="Evaluation">Evaluation</option>
              </Select>
              <Text fontWeight="semibold">CATEGORY</Text>
              <Select
                size="sm"
                value={SelectedOption}
                onChange={handleChangeOption}
                mb={4}
              >
                <option value="Identification">Identification</option>
                <option value="Enumeration">Enumeration</option>
                <option value="True/False">True/False</option>
                <option value="Multiple">Multiple Choice</option>
              </Select>
              <Text fontWeight="semibold">OPTIONS</Text>
              {renderFormElement()}
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="green"
              rightIcon={<TbCheck />}
              size="sm"
              onClick={HandleCreate}
            >
              CREATE
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
}
