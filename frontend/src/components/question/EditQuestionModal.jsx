import {
  Stack,
  Radio,
  RadioGroup,
  Select,
  Flex,
  Input,
  CheckboxGroup,
  Checkbox,
  HStack,
  FormControl,
  FormLabel,
  FormErrorMessage
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import useUserStore from "../../helper/useUserStore";
import QuestionChoices from "../composites/QuestionChoices";

export default function EditQuestionModal({
  QuestionData,
  SetUpdatedQuestionData,
  choicesError,
  termsError,
  questionError,
  isEditing,
  multipleChoiceError
}) {
  const { user } = useUserStore();
  const parsedSubjects = JSON.parse(user.user_assigned_subject) || [];
  const parsedDepartments = JSON.parse(user.user_assigned_department) || [];
  const [subjects, setSubjects] = useState([])
  const [departments, setDepartments] = useState([])
  const [selectedSubject, setSelectedSubject] = useState(QuestionData.subject);
  const [selectedDepartment, setSelectedDepartment] = useState(QuestionData.department);
  const [selectedClassification, setSelectedClassification] = useState(QuestionData.classification)
  const [selectedCategory, setSelectedCategory] = useState(QuestionData.category)
  const [multipleChoices, setMultipleChoices] = useState(QuestionData.options ? JSON.parse(QuestionData.options) : []);
  const [question, setQuestion] = useState(QuestionData.question);
  const [selectedTerms, setSelectedTerms] = useState(
    JSON.parse(QuestionData.terms)
  );

  const data = {
    id: QuestionData.id,
    question: question,
    options: multipleChoices,
    answer: multipleChoices.filter((item) => item.is_correct === true),
    category: selectedCategory,
    created_by: user.fullname,
    terms: selectedTerms,
    department: selectedDepartment,
    subject: selectedSubject,
    classification: selectedClassification,
  };

  useEffect(() => {
    SetUpdatedQuestionData(data)
  }, [
    question,
    multipleChoices,
    selectedCategory,
    selectedTerms,
    selectedClassification,
    selectedSubject,
    selectedDepartment
  ])

  useEffect(() => {
    if (user.usertype === "Admin") {
      axios
        .get(`${import.meta.env.VITE_API_HOST}SubjectRoute.php`, {
          params: { action: "GetAllSubjects", type: user.usertype },
        })
        .then(({ data }) => {
          setSubjects(data);
          setSelectedSubject(data[0]?.name || "");
        })
        .catch(console.error);
    } else {
      setSubjects(parsedSubjects);
      setSelectedSubject(parsedSubjects[0]);
    }

    if (user.usertype === "Admin") {
      axios
        .get(`${import.meta.env.VITE_API_HOST}SubjectRoute.php`, {
          params: { action: "GetAllDepartments", type: user.usertype },
        })
        .then(({ data }) => {
          setDepartments(data);
          setSelectedDepartment(data[0]?.name || "");
        })
        .catch(console.error);
    } else {
      setDepartments(parsedDepartments);
      setSelectedDepartment(parsedDepartments[0]);
    }
  }, []);

  const updateMultipleChoices = (type) => {
    switch (type) {
      case "Identification":
        setMultipleChoices([{ id: 1, option: "", is_correct: true }]);
        break;
      case "Numeric":
        setMultipleChoices([{ id: 1, option: "", is_correct: true }]);
        break;
      case "True/False":
        setMultipleChoices([
          { id: 1, option: "True", is_correct: false },
          { id: 2, option: "False", is_correct: false },
        ]);
        break;
      case "Enumeration":
        setMultipleChoices([]);
        break;
      case "Multiple":
        setMultipleChoices([
          { id: 1, option: "Option 1", is_correct: false },
          { id: 2, option: "Option 2", is_correct: false },
          { id: 3, option: "Option 3", is_correct: false },
          { id: 4, option: "Option 4", is_correct: false },
        ]);
        break;
      default:
        setMultipleChoices([]);
    }
  };

  const handleCheckboxChange = (value) => {
    setSelectedTerms((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  return (
    <Stack spacing={4}>
      <FormControl isRequired isInvalid={questionError}>
        <FormLabel>Question</FormLabel>
        <Input
          type="text"
          value={question}
          placeholder="Enter question"
          onChange={(e) => setQuestion(e.currentTarget.value)}
        />
        {questionError && <FormErrorMessage>Question is required.</FormErrorMessage>}
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Subject</FormLabel>
        <Select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
          {subjects.map((subject, key) => (
            <option value={subject.name || subject} key={key}>{subject.name || subject}</option>
          ))}
        </Select>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Department</FormLabel>
        <Select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
          {departments.map((department, key) => (
            <option value={department.name || department} key={key}>{department.name || department}</option>
          ))}
        </Select>
      </FormControl>
      <FormControl isRequired isInvalid={termsError}>
        <FormLabel>Terms</FormLabel>
        <CheckboxGroup colorScheme="blue">
          <HStack justifyContent="space-evenly" mb={4}>
            <Checkbox
              isChecked={selectedTerms.includes("Prelims")}
              onChange={() => handleCheckboxChange("Prelims")}
            >
              Prelims
            </Checkbox>
            <Checkbox
              isChecked={selectedTerms.includes("Midterms")}
              onChange={() => handleCheckboxChange("Midterms")}
            >
              Midterms
            </Checkbox>
            <Checkbox
              isChecked={selectedTerms.includes("Finals")}
              onChange={() => handleCheckboxChange("Finals")}
            >
              Finals
            </Checkbox>
          </HStack>
        </CheckboxGroup>
        {termsError && <FormErrorMessage>Please select at least one term.</FormErrorMessage>}
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Classification</FormLabel>
        <Select value={selectedClassification} onChange={(e) => setSelectedClassification(e.target.value)}>
          {["Knowledge", "Comprehension", "Application", "Analysis", "Synthesis", "Evaluation"].map((val) => (
            <option key={val} value={val}>{val}</option>
          ))}
        </Select>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Category</FormLabel>
        <Select value={selectedCategory} onChange={(e) => { setSelectedCategory(e.target.value); updateMultipleChoices(e.target.value); }}>
          {["Identification", "True/False", "Multiple", "Numeric"].map(type => <option key={type} value={type}>{type}</option>)}
        </Select>
      </FormControl>
      <FormControl isRequired isInvalid={choicesError}>
        <FormLabel>Choices and Answers</FormLabel>
        <QuestionChoices 
          setMultipleChoices={setMultipleChoices}
          multipleChoices={multipleChoices}
          category={selectedCategory}
          isEditing={true}
        />
        {choicesError && (
          <FormErrorMessage>
            Provide at least one non-empty choice and mark a correct answer.
          </FormErrorMessage>
        )}
      </FormControl>
    </Stack>
  );
}