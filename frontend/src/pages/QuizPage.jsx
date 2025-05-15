import {
  Heading,
  Stack,
  Flex,
  Card,
  Tag,
  CardHeader,
  Checkbox,
  Icon,
  CardBody,
  Divider,
  Button,
  useDisclosure,
  RadioGroup,
  Radio,
  HStack,
  SimpleGrid,
  Text,
  FormControl,
  FormLabel,
  Input,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

import Swal from "sweetalert2"
import { useEffect, useState } from "react";
import axios from 'axios'
import { BiCheck, BiPlus } from "react-icons/bi";
import useUserStore from "../helper/useUserStore";
import { TbArrowDown, TbArrowUp, TbTrash } from "react-icons/tb";
import { PrimeReactProvider } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const QuizTable = ({ data }) => {
  return (
    <PrimeReactProvider>
      <DataTable
        value={data}
        paginator
        rows={15}
        rowsPerPageOptions={[10, 15, 30]}
        showGridlines
      >
        <Column field="id" header="ID" />
        <Column field="quiz_name" header="Quiz Name" />
        <Column field="department" header="Department" />
        <Column field="subject" header="Subject" />
        <Column field="created_by" header="Created By" />
      </DataTable>
    </PrimeReactProvider>
  )
}

export default function QuizPage() {
  const [quizzes, setQuizzes] = useState([])
  const [questionSet, setQuestionSet] = useState([]);
  const { usertype, user_assigned_subject, user_assigned_department, fullname } = useUserStore((state) => state.user);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const parsedSubjects = JSON.parse(user_assigned_subject);
  const parsedDepartments = JSON.parse(user_assigned_department);
  const [availableQuestions, setAvailableQuestions] = useState([])
  const [quizName, setQuizName] = useState("")
  // SUBJECT
  const [subjects, setSubjects] = useState([])
  const [selectedSubject, setSelectedSubject] = useState("")
  // DEPARTMENT
  const [departments, setDepartments] = useState([])
  const [selectedDepartment, setSelectedDepartment] = useState("")

  // get datatable quiz data
  const fetchQuizzes = () => {
    axios.get(`${import.meta.env.VITE_API_HOST}QuizRoute.php`, {
      params: {
        action: "get_quizzes",
        usertype: usertype,
        fullname: fullname
      }
    })
      .then(({ data }) => {
        console.log(data)
        setQuizzes(data);
      })
      .catch(console.error);
  };

  // initialize datatable
  useEffect(() => {
    console.log(parsedSubjects)
    console.log(parsedDepartments)
    fetchQuizzes()
  }, [])

  //populate subject and department select element
  useEffect(() => {
    if (usertype === "Admin") {
      axios.get(`${import.meta.env.VITE_API_HOST}SubjectRoute.php`, { params: { action: "GetAllSubjects", type: usertype } })
        .then(({ data }) => {
          const subjects = data.map(subject => subject.name);
          setSubjects(subjects);
          setSelectedSubject(data[0].name);
        })
        .catch(console.error);
    } else {
      setSubjects(parsedSubjects);
      setSelectedSubject(parsedSubjects[0]);
    }

    if (usertype === "Admin") {
      axios.get(`${import.meta.env.VITE_API_HOST}SubjectRoute.php`, { params: { action: "GetAllDepartments", type: usertype } })
        .then(({ data }) => {
          const departments = data.map(department => department.name);
          setDepartments(departments);
          setSelectedDepartment(data[0].name);
        })
        .catch(console.error);
    } else {
      setDepartments(parsedDepartments);
      setSelectedDepartment(parsedDepartments[0]);
    }
  }, [])

  // change available quiz based on selected department and subject
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_HOST}QuizRoute.php`, {
      params: {
        action: "get_available_questions",
        department: selectedDepartment,
        subject: selectedSubject
      }
    })
      .then(({ data }) => {
        setQuestionSet([])
        setAvailableQuestions(data);
      })
      .catch(console.error);
  }, [selectedDepartment, selectedSubject])

  // rendering question in preview
  const renderFormElement = (options, category) => {
    switch (category) {
      case "Identification": {
        return (
          <Input size="sm" value={JSON.parse(options)[0].option} readOnly />
        );
      }
      case "Numeric": {
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
            <HStack spacing={4}>
              {JSON.parse(options).map((option) => (
                <Radio key={option.id} isChecked={option.is_correct}>
                  {option.option}
                </Radio>
              ))}
            </HStack>
          </RadioGroup>
        );
      }

      case "Multiple":
        return (
          <RadioGroup>
            <HStack spacing={4}>
              {JSON.parse(options).map((option) => (
                <Flex
                  key={option.id}
                  direction="row"
                  alignItems="center"
                  gap={4}
                >
                  <Checkbox isChecked={option.is_correct} />
                  <Input size="sm" type="text" value={option.option} readOnly />
                </Flex>
              ))}
            </HStack>
          </RadioGroup>
        );
      default:
        return null;
    }
  };

  // check if selected
  const CheckIfSelected = (qid) => {
    if (questionSet.some((q) => q.id === qid)) {
      return true;
    } else {
      return false;
    }
  }

  // handling moving item in preview
  const moveItem = (index, direction) => {
    setQuestionSet((prevItems) => {
      const newItems = [...prevItems];
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= newItems.length) return prevItems;
      [newItems[index], newItems[newIndex]] = [
        newItems[newIndex],
        newItems[index],
      ];
      return newItems;
    });
  };

  // handling if checkbox
  const handleCheckboxChange = (id) => {
    setQuestionSet((prevItems) => {
      const isAlreadySelected = prevItems.some((item) => item.id === id);

      if (isAlreadySelected) {
        return prevItems.filter((item) => item.id !== id);
      } else {
        return [...prevItems, availableQuestions.find((q) => q.id === id)];
      }
    });
  };

  // handle delete from preview
  const handleDelete = (id) => {
    setQuestionSet((prevSet) => prevSet.filter((item) => item.id !== id));
  };

  // Create Quiz
  const handleCreateQuiz = () => {
    onClose()

    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to create a new quiz!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, create it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        const data = {
          quiz_name: quizName,
          subject: selectedSubject,
          department: selectedDepartment,
          questions: questionSet,
          created_by: fullname
        };

        axios.post(`${import.meta.env.VITE_API_HOST}QuizRoute.php?action=create`, data, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(({ data }) => {
            Swal.fire({
              title: 'Quiz Created!',
              text: 'Your quiz has been successfully created.',
              icon: 'success',
              confirmButtonText: 'OK'
            });
            fetchQuizzes();
            setQuestionSet([])
            setQuizName([])
          })
          .catch((error) => {
            Swal.fire({
              title: 'Error!',
              text: 'There was an issue creating the quiz. Please try again later.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
            console.error(error);
          });
      }else {
        onOpen()
      }
    });
  };

  return (
    <>
      <Modal size="full" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Quiz</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SimpleGrid gap={4} columns={3}>
              <Stack>
                <Heading size="md">Preview</Heading>
                <Stack>
                  {questionSet.map((item, index) => (
                    <Card key={item.id}>
                      <CardBody>
                        <Stack spacing={4}>
                          <Flex direction="row">
                            <Text fontSize="14px" fontWeight="semibold" mr="auto">
                              {index + 1}. {item.question}
                            </Text>

                            <Text fontWeight="semibold" fontSize="10px" mr={2}>
                              {item.classification}
                            </Text>
                            <Button
                              size="xs"
                              mr={1}
                              onClick={() => moveItem(index, -1)}
                              isDisabled={index === 0}
                            >
                              <Icon as={TbArrowUp} />
                            </Button>
                            <Button
                              size="xs"
                              mr={1}
                              onClick={() => moveItem(index, 1)}
                              isDisabled={index === questionSet.length - 1}
                            >
                              <Icon as={TbArrowDown} />
                            </Button>
                            <Button
                              size="xs"
                              colorScheme="red"
                              onClick={() => handleDelete(item.id)}
                            >
                              <Icon as={TbTrash} />
                            </Button>
                          </Flex>
                          {renderFormElement(item.options, item.category)}
                        </Stack>
                      </CardBody>
                    </Card>
                  ))}
                </Stack>
              </Stack>
              <Stack>
                <Heading size="md">Question List</Heading>
                <Stack>
                  {availableQuestions.map((item) => (
                    <Flex direction="row" key={item.id}>
                      <Checkbox
                        key={item.id}
                        mr={4}
                        onChange={() => handleCheckboxChange(item.id)}
                        isChecked={CheckIfSelected(item.id)}
                      />
                      <Text fontWeight="semibold">{item.question}</Text>
                      <Tag ml="auto" size="sm">
                        {item.category}
                      </Tag>
                    </Flex>
                  ))}
                </Stack>
              </Stack>
              <Stack>
                <Heading size="md">Info</Heading>
                <FormControl isRequired mt={2}>
                  <FormLabel>Quiz Name</FormLabel>
                  <Input value={quizName} onChange={(e) => setQuizName(e.currentTarget.value)} placeholder="Mathematics short quiz 1" />
                </FormControl>
                <FormControl isRequired mt={2}>
                  <FormLabel>Subject</FormLabel>
                  <Select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                    {subjects.map((subject, key) => (
                      <option value={subject} key={key}>{subject}</option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl isRequired mt={2}>
                  <FormLabel>Department</FormLabel>
                  <Select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
                    {departments.map((department, key) => (
                      <option value={department} key={key}>{department}</option>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </SimpleGrid>
          </ModalBody>

          <ModalFooter>
            <Button mr={4} onClick={onClose}>Close</Button>

            <Button onClick={handleCreateQuiz} rightIcon={<BiCheck />} colorScheme='green'>
              Create Quiz
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Stack>
        <Card
          height="100dvh"
        >
          <CardHeader backgroundColor="#141414" color="#fff">
            <Flex
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Heading>Quiz Bank</Heading>
              <Button leftIcon={<BiPlus />} colorScheme="green" onClick={onOpen}>Create Quiz</Button>
            </Flex>
          </CardHeader>
          <Divider />
          <CardBody p={0}>
            <QuizTable
              data={quizzes}
            />
          </CardBody>
        </Card>
      </Stack>
    </>
  );
}