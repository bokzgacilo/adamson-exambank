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
import { useEffect, useState } from "react";
import axios from "axios";

import PropTypes from "prop-types";
import useUserStore from "../helper/useUserStore";

EditQuestionForm.propTypes = {
  QuestionData: PropTypes.object.isRequired,
  SetUpdatedQuestionData: PropTypes.func.isRequired,
  category: PropTypes.string,
  options: PropTypes.array,
};

export default function EditQuestionForm({
  QuestionData,
  SetUpdatedQuestionData,
}) {
  const { user } = useUserStore();
  const parsedSubjects = JSON.parse(user.user_assigned_subject) || [];
  const [SelectedOption, SetSelectedOption] = useState(QuestionData.category);
  const [SelectedClassification, SetSelectedClassification] = useState(
    QuestionData.classification
  );
  const [MultipleChoices, SetMultipleChoices] = useState(
    QuestionData.options ? JSON.parse(QuestionData.options) : []
  );
  const [EnumerationText, SetEnumerationText] = useState(
    MultipleChoices.map((choice) => choice.option).join("\n")
  );
  const [Question, SetQuestion] = useState(QuestionData.question);
  const [Subjects, SetSubjects] = useState([]);
  const [SelectedSubject, SetSelectedSubject] = useState("");
  const [SelectedTerms, SetSelectedTerms] = useState(
    JSON.parse(QuestionData.terms)
  );

  const data = {
    id: QuestionData.id,
    question: Question,
    options: MultipleChoices,
    answer: MultipleChoices.filter((item) => item.is_correct === true),
    category: SelectedOption,
    created_by: user.fullname,
    terms: SelectedTerms,
    subject: SelectedSubject,
    classification: SelectedClassification,
  };

  useEffect(() => {
    SetUpdatedQuestionData(data)
  }, [
    Question,
    MultipleChoices,
    SelectedOption,
    SelectedTerms,
    SelectedClassification,
    SelectedSubject
  ])

  useEffect(() => {
    if (parsedSubjects.includes("None") || parsedSubjects.length === 0) {
      axios
        .get("http://localhost/exam-bank/api/SubjectRoute.php", {
          params: { action: "GetAllSubjects", type: user.usertype },
        })
        .then(({ data }) => {
          SetSubjects(data);
          SetSelectedSubject(data[0]?.name || "");
        })
        .catch(console.error);
    } else {
      SetSubjects(parsedSubjects);
      SetSelectedSubject(parsedSubjects[0]);
    }
  }, []);

  const handleChangeSelectedSubject = (e) => {
    const subject = e.target.value;
    SetSelectedSubject(subject);
  };

  const handleChangeClassification = (e) => {
    const classification = e.target.value;
    SetSelectedClassification(classification);
  };

  const RenderSubject = () => {
    return user.usertype === "Instructor" || user.usertype === "Coordinator" ? (
      <Select
        value={SelectedSubject}
        onChange={handleChangeSelectedSubject}
        mb={4}
        size="sm"
      >
        {Subjects.map((subject, index) => (
          <option key={index} value={subject}>
            {subject}
          </option>
        ))}
      </Select>
    ) : (
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
    );
  };

  const updateMultipleChoices = (type) => {
    switch (type) {
      case "Identification":
        SetMultipleChoices([{ id: 1, option: "", is_correct: true }]);
        break;
      case "Numeric":
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
      prev.map((option) => ({
        ...option,
        is_correct: option.id === selectedId, // Ensure only one is selected
      }))
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
            size="sm"
            type="text"
            onChange={(e) => handleInputChange(1, e.target.value)}
            value={MultipleChoices[0].option}
          />
        );
      case "Numeric":
        return (
          <Input
            size="sm"
            type="number"
            onChange={(e) => handleInputChange(1, e.target.value)}
            value={MultipleChoices[0].option}
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
  value={MultipleChoices.find((option) => option.is_correct)?.id || ""}
  onChange={(val) => handleRadioChange(Number(val))}
>
  <Stack spacing={2}>
    {MultipleChoices.map((option) => (
      <Radio key={option.id} value={option.id}>
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
                    size="sm"
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
        onChange={handleChangeClassification}
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
        <option value="True/False">True/False</option>
        <option value="Multiple">Multiple Choice</option>
        <option value="Numeric">Numeric</option>
      </Select>
      <Text fontWeight="semibold">OPTIONS</Text>
      {renderFormElement()}
    </Stack>
  );
}
