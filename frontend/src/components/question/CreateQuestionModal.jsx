import { useEffect, useState } from "react";
import useUserStore from "../../helper/useUserStore";
import Swal from "sweetalert2"
import {
  Button,
  Heading,
  Stack,
  Text,
  Flex,
  RadioGroup,
  Radio,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  FormControl,
  FormErrorMessage,
  FormLabel,
  CheckboxGroup,
  HStack,
  Checkbox,
  Select,
  ModalCloseButton,
} from "@chakra-ui/react";
import { TbCheck } from "react-icons/tb";
import axios from "axios"

export default function CreateQuestionModal({ isOpen, onClose, onOpen, refreshTable, isFormExam }) {
  const { user } = useUserStore();
  const parsedSubjects = JSON.parse(user.user_assigned_subject)
  const parsedDepartments = JSON.parse(user.user_assigned_department)

  const [question, setQuestion] = useState("")
  const [subjects, setSubjects] = useState([])
  const [departments, setDepartments] = useState([])
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [selectedTerms, setSelectedTerms] = useState([]);
  const [selectedModule, setSelectedModule] = useState("Module 1");
  const [selectedClassification, setSelectedClassification] = useState("Knowledge")
  const [selectedCategory, setSelectedCategory] = useState("Identification")
  const [multipleChoices, setMultipleChoices] = useState([]);

  // for tracking validation of inputs
  const [questionError, setQuestionError] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [choicesError, setChoicesError] = useState(false);
  const [multipleChoiceError, setMultipleChoiceError] = useState(false);

  useEffect(() => {
    updateMultipleChoices(selectedCategory);

    if (user.usertype === "Admin") {
      axios.get(`${import.meta.env.VITE_API_HOST}SubjectRoute.php`, { params: { action: "GetAllDepartments", type: user.usertype } })
        .then(({ data }) => {
          setDepartments(data);
          setSelectedDepartment(data[0].name);
        })
        .catch(console.error);
    } else {
      setDepartments(parsedDepartments);
      setSelectedDepartment(parsedDepartments[0]);
    }

    if (user.usertype === "Admin") {
      axios.get(`${import.meta.env.VITE_API_HOST}SubjectRoute.php`, { params: { action: "GetAllSubjects", type: user.usertype } })
        .then(({ data }) => {
          setSubjects(data);
          setSelectedSubject(data[0].name);
        })
        .catch(console.error);
    } else {
      setSubjects(parsedSubjects);
      setSelectedSubject(parsedSubjects[0]);
    }
  }, [])

  const updateMultipleChoices = (type) => {
    const templates = {
      Identification: [{ id: 1, option: "", is_correct: true }],
      "True/False": [
        { id: 1, option: "True", is_correct: false },
        { id: 2, option: "False", is_correct: false }
      ],
      Enumeration: [],
      Multiple: Array.from({ length: 4 }, (_, i) => ({ id: i + 1, option: "", is_correct: false }))
    };
    setMultipleChoices(templates[type] || []);
  };

  // handle create question for exam
  const handleCreateQuestion = () => {
    const isQuestionEmpty = question.trim() === "";
    const isTermsEmpty = selectedTerms.length === 0;
    const hasValidOption = multipleChoices.some(choice => choice.option.trim() !== "");
    const hasCorrectAnswer = multipleChoices.some(choice => choice.is_correct);
    const allChoicesHaveValue = multipleChoices.every(choice => choice.option.trim() !== "");

    setQuestionError(isQuestionEmpty);
    if (isQuestionEmpty) return;

    setTermsError(isTermsEmpty);
    if (isTermsEmpty) return;

    const hasChoiceErrors = !hasValidOption || !hasCorrectAnswer;
    setChoicesError(hasChoiceErrors);
    if (hasChoiceErrors) return;

    setMultipleChoiceError(!allChoicesHaveValue);
    if (!allChoicesHaveValue) return;

    onClose()

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to create this question?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, create it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const data = {
          question,
          subject: selectedSubject,
          department: selectedDepartment,
          terms: selectedTerms,
          classification: selectedClassification,
          category: selectedCategory,
          options: multipleChoices,
          answer: multipleChoices,
          created_by: user.fullname
        };

        axios.post(`${import.meta.env.VITE_API_HOST}QuestionRoute.php?action=create`, data, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(() => {
            Swal.fire('Created!', 'Your question has been created.', 'success');
            refreshTable()
            setQuestion("")
            setMultipleChoices([])
          })
          .catch((error) => {
            onOpen()
            console.error(error);
            Swal.fire('Error', 'Failed to create question.', 'error');
          });
      } else {
        onOpen()
      }
    });
  };

  // handle create question for quiz
  const handleCreateQuizQuestion = () => {
    const isQuestionEmpty = question.trim() === "";
    const hasValidOption = multipleChoices.some(choice => choice.option.trim() !== "");
    const hasCorrectAnswer = multipleChoices.some(choice => choice.is_correct);
    const allChoicesHaveValue = multipleChoices.every(choice => choice.option.trim() !== "");

    setQuestionError(isQuestionEmpty);
    if (isQuestionEmpty) return;

    const hasChoiceErrors = !hasValidOption || !hasCorrectAnswer;
    setChoicesError(hasChoiceErrors);
    if (hasChoiceErrors) return;

    setMultipleChoiceError(!allChoicesHaveValue);
    if (!allChoicesHaveValue) return;

    onClose()

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to create this question for quiz?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, create it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const data = {
          question,
          subject: selectedSubject,
          department: selectedDepartment,
          module: selectedModule,
          category: selectedCategory,
          options: multipleChoices,
          answer: multipleChoices,
          created_by: user.fullname,
          usertype: user.usertype,
          user_department: JSON.parse(user.user_assigned_department)[0]
        };

        axios.post(`${import.meta.env.VITE_API_HOST}QuizQuestionRoute.php?route=create`, data)
          .then((response) => {
            console.log(response.data)
            Swal.fire('Created!', 'Your question has been created.', 'success');
            refreshTable()
            setQuestion("")
            setMultipleChoices([])
          })
          .catch((error) => {
            onOpen()
            console.error(error);
            Swal.fire('Error', 'Failed to create question.', 'error');
          });
      } else {
        onOpen()
      }
    });
  };


  return (
    <Modal size="xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>
          <Heading size="lg">Create Question</Heading>
        </ModalHeader>
        <ModalBody>
          <Stack spacing={4}>
            <FormControl isRequired isInvalid={questionError}>
              <FormLabel>Question</FormLabel>
              <Input value={question} onChange={(e) => setQuestion(e.currentTarget.value)} placeholder="What is the biggest ocean?" type='text' />
              {questionError && <FormErrorMessage>Question is required.</FormErrorMessage>}
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Subject</FormLabel>
              <Select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                {subjects.map((subject, index) => (
                  <option key={index} value={subject.name || subject}>{subject.name || subject}</option>
                ))}
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Department</FormLabel>
              <Select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
                {departments.map((department, index) => (
                  <option key={index} value={department.name || department}>{department.name || department}</option>
                ))}
              </Select>
            </FormControl>
            {isFormExam ?
              <>
                <FormControl isRequired isInvalid={termsError}>
                  <FormLabel>Terms</FormLabel>
                  <CheckboxGroup colorScheme="blue" value={selectedTerms} onChange={setSelectedTerms}>
                    <HStack justifyContent="space-evenly">
                      {["Prelims", "Midterms", "Finals"].map((term, index) => <Checkbox key={index} value={term}>{term}</Checkbox>)}
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
              </>

              :
              <FormControl isRequired>
                <FormLabel>Module</FormLabel>
                <Select variant="filled" rounded="full" value={selectedModule} onChange={(e) => setSelectedModule(e.target.value)}>
                    {[
                      "Module 1",
                      "Module 2",
                      "Module 3",
                      "Module 4",
                      "Module 5",
                      "Module 6",
                      "Module 7",
                      "Module 8",
                      "Module 9",
                      "Module 10"
                    ].map((val, index) => <option key={index} value={val}>{val}</option>)}
                </Select>
              </FormControl>
            }

            <FormControl isRequired>
              <FormLabel>Category</FormLabel>
              <Select value={selectedCategory} onChange={(e) => { setSelectedCategory(e.target.value); updateMultipleChoices(e.target.value); }}>
                {["Identification", "True/False", "Multiple", "Numeric"].map(type => <option key={type} value={type}>{type}</option>)}
              </Select>
            </FormControl>
            <FormControl isRequired isInvalid={choicesError}>
              <FormLabel>Choices and Answers</FormLabel>
              {selectedCategory === "Identification" && <Input placeholder="Enter answer" onChange={(e) => setMultipleChoices([{ id: 1, option: e.target.value, is_correct: true }])} />}
              {selectedCategory === "Numeric" && <Input type="number" placeholder="Enter answer" onChange={(e) => setMultipleChoices([{ id: 1, option: e.target.value, is_correct: true }])} />}
              {selectedCategory === "True/False" &&
                <RadioGroup onChange={(val) => setMultipleChoices(multipleChoices.map(opt => ({ ...opt, is_correct: opt.option.toLowerCase() === val })))}>
                  <Stack>
                    {multipleChoices.map(opt =>
                      <Radio key={opt.id} value={opt.option.toLowerCase()}>{opt.option}</Radio>
                    )}
                  </Stack>
                </RadioGroup>}
              {selectedCategory === "Multiple" && (
                <Stack spacing={4}>
                  {multipleChoices.map((opt, key) => (
                    <Flex key={opt.id} alignItems="center" gap={4}>
                      <Checkbox
                        size="lg"
                        isChecked={opt.is_correct}
                        onChange={() =>
                          setMultipleChoices(
                            multipleChoices.map(o =>
                              o.id === opt.id ? { ...o, is_correct: !o.is_correct } : o
                            )
                          )
                        }
                      />
                      <FormControl isInvalid={multipleChoiceError && opt.option.trim() === ""}>
                        <Input
                          placeholder={`Choice ${key + 1}`}
                          value={opt.option}
                          onChange={(e) =>
                            setMultipleChoices(
                              multipleChoices.map(o =>
                                o.id === opt.id ? { ...o, option: e.target.value } : o
                              )
                            )
                          }
                        />
                      </FormControl>
                    </Flex>
                  ))}
                  {multipleChoiceError && (
                    <Text color="red.500" fontSize="sm">
                      All choices must have a value.
                    </Text>
                  )}
                </Stack>
              )}

              {choicesError && (
                <FormErrorMessage>
                  Provide at least one non-empty choice and mark a correct answer.
                </FormErrorMessage>
              )}
            </FormControl>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} mr={4}>Cancel</Button>
          <Button colorScheme="green" rightIcon={<TbCheck />} onClick={isFormExam ? handleCreateQuestion : handleCreateQuizQuestion}>Create Single</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}