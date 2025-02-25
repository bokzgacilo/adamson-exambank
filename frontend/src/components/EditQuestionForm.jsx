import {
  Stack,
  Radio,
  RadioGroup,
  Select,
  Flex,
  Text,
  Textarea,
  Input,
  CheckboxGroup,
  Checkbox,
  HStack,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

import PropTypes from "prop-types";
import useUserStore from "../helper/useUserStore";

EditQuestionForm.propTypes = {
  category: PropTypes.string,
  options: PropTypes.array,
};

export default function EditQuestionForm({ QuestionData, SetUpdatedQuestionData }) {
  const hasFetched = useRef(false)
  const { fullname, user_assigned_subject, usertype } = useUserStore(
    (state) => state.user
  );
  const [SelectedOption, SetSelectedOption] = useState(QuestionData.category);
  const [MultipleChoices, SetMultipleChoices] = useState(
    QuestionData.options ? JSON.parse(QuestionData.options) : []
  );
  const [EnumerationText, SetEnumerationText] = useState(
    MultipleChoices.map((choice) => choice.option).join("\n")
  );
  const [Question, SetQuestion] = useState(QuestionData.question);
  const [Subjects, SetSubjects] = useState([]);
  const [SelectedSubject, SetSelectedSubject] = useState(user_assigned_subject);
  const [SelectedTerms, SetSelectedTerms] = useState(JSON.parse(QuestionData.terms));

  const data = {
    id: QuestionData.id,
    question: Question,
    options: MultipleChoices,
    answer: MultipleChoices.filter((item) => item.is_correct === true),
    category: SelectedOption,
    created_by: fullname,
    terms: SelectedTerms,
    subject: SelectedSubject,
  };

  useEffect(() => {
    SetUpdatedQuestionData(data)

    if (!hasFetched.current && user_assigned_subject === "none") {
      hasFetched.current = true; 
      axios
        .get("http://localhost/exam-bank/api/SubjectRoute.php", {
          params: { action: "GetAllSubjects", type: usertype },
        })
        .then((response) => {
          SetSubjects(response.data);
          SetSelectedSubject(response.data[0].name);
        })
        .catch((error) => {
          console.error("Error fetching subjects:", error);
        });
    }
  }, [Question, MultipleChoices, SelectedOption, SelectedTerms, SelectedSubject]);

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
      >
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
        return <Input type="text" onChange={(e) => handleInputChange(1, e.target.value)} value={MultipleChoices[0].option} />;
      case "Enumeration":
        return (
          <>
            <Text>Separate answers by new line</Text>
            <Textarea
              value={EnumerationText}
              onChange={handleEnumerationChange}
              placeholder="Enter answers"
            />
          </>
        );
      case "True/False":
        return (
          <RadioGroup onChange={(val) => handleRadioChange(val === "true" ? 1 : 2)}>
            <Stack spacing={2}>
              {MultipleChoices.map((option) => (
                <Radio key={option.id} value={option.option.toLowerCase()} isChecked={option.is_correct}>
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
                    onChange={() => handleRadioChange(option.id)}
                    isChecked={option.is_correct}
                  />
                  <Input
                    onChange={(e) =>
                      handleInputChange(option.id, e.target.value)
                    }
                    type="text"
                    value={option.option}
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
    <Stack>
      <Text fontWeight="semibold">SUBJECT</Text>
      {RenderSubject()}
      <Text fontWeight="semibold">QUESTION</Text>
      <Input
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
      <Text fontWeight="semibold">CATEGORY</Text>
      <Select value={SelectedOption} onChange={handleChangeOption} mb={4}>
        <option value="Identification">Identification</option>
        <option value="Enumeration">Enumeration</option>
        <option value="True/False">True/False</option>
        <option value="Multiple">Multiple Choice</option>
      </Select>
      <Text fontWeight="semibold">OPTIONS</Text>
      {renderFormElement()}
    </Stack>
  );
}
