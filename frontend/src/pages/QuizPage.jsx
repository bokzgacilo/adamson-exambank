import {
  Heading,
  Stack,
  Flex,
  Tooltip,
  IconButton,
  Card,
  Tag,
  CardHeader,
  Checkbox,
  Icon,
  CardBody,
  Divider,
  Button,
  useDisclosure,
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
import { TbArrowDown, TbArrowUp, TbDownload, TbEdit, TbTrash } from "react-icons/tb";
import { PrimeReactProvider } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import QuizQuestionListElement from "../components/composites/QuizQuestionListElement";
import QuizChoices from "../components/composites/QuizChoices";
import { deleteItem, moveItem } from "../helper/main";

const QuizDetail = ({ quiz }) => {
  return (
    <Stack spacing={4}>
      <QuizQuestionListElement questionSet={JSON.parse(quiz.questions)} />
    </Stack>
  )
}

const QuizTable = ({ data, refreshTable, setIsEditing, setQuestionSet, setSelectedId, setQuizName, openCreateQuiz }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedQuiz, setSelectedQuiz] = useState([])
  const { user } = useUserStore();

  const handleQuizClick = (rowData) => {
    setSelectedQuiz(rowData)
    onOpen()
  }

  const handleEdit = (rowData) => {
    console.log(rowData)
    setSelectedId(rowData.id)
    setIsEditing(true)
    setQuestionSet(JSON.parse(rowData.questions))
    setQuizName(rowData.quiz_name)
    openCreateQuiz()
  }

  const handleExport = (rowData) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to export this quiz?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, export it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post(
          `${import.meta.env.VITE_API_HOST}ExamRoute.php?action=export`,
          {
            name: user.fullname,
            test_name: rowData.quiz_name,
            type: "QUIZ",
            data: JSON.parse(rowData.questions),
            subject: rowData.subject,
            usertype: user.usertype,
            department: JSON.parse(user.user_assigned_department)[0]
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
            link.download = `${rowData.quiz_name}_export.txt`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          })
          .catch((error) => {
            console.error('Export failed:', error);
            Swal.fire('Error', 'Export failed. Please try again.', 'error');
          });
      }
    });
  };

  const handleDeleteQuiz = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This quiz will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e53e3e', // red
      cancelButtonColor: '#718096',  // gray
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.get(`${import.meta.env.VITE_API_HOST}QuizRoute.php`, {
          params: {
            action: 'delete',
            id: id,
            created_by: user.fullname,
            usertype: user.usertype,
            department: JSON.parse(user.user_assigned_department)[0]
          }
        })
          .then(() => {
            Swal.fire('Deleted!', 'The quiz has been deleted.', 'success');
            refreshTable();
          })
          .catch(() => {
            Swal.fire('Error', 'Failed to delete quiz.', 'error');
          });
      }
    });
  };


  return (
    <PrimeReactProvider>
      <Modal size="xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <ModalCloseButton />
            <Heading size="lg">{selectedQuiz.quiz_name}</Heading>
          </ModalHeader>
          <ModalBody>
            <QuizDetail quiz={selectedQuiz} />
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={onClose}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <DataTable
        value={data}
        paginator
        rows={15}
        rowsPerPageOptions={[10, 15, 30]}
        showGridlines
      >
        <Column field="id" header="ID" />
        <Column
          field="quiz_name"
          header="Quiz Name"
          body={(rowData) => (
            <Text
              fontWeight="bold"
              cursor="pointer"
              onClick={() => handleQuizClick(rowData)}
              _hover={{ textDecoration: 'underline' }}
            >
              {rowData.quiz_name}
            </Text>
          )}
        />
        <Column field="department" header="Department" />
        <Column field="subject" header="Subject" />
        <Column field="created_by" header="Created By" />
        <Column
          header="Action"
          body={(rowData) => (
            <HStack spacing={2}>
              <Tooltip label="Edit">
                <IconButton
                  icon={<TbEdit />}
                  colorScheme="yellow"
                  aria-label="Export"
                  onClick={() => handleEdit(rowData)}
                />
              </Tooltip>
              <Tooltip label="Export">
                <IconButton
                  icon={<TbDownload />}
                  colorScheme="green"
                  aria-label="Export"
                  onClick={() => handleExport(rowData)}
                />
              </Tooltip>
              <Tooltip label="Delete">
                <IconButton
                  icon={<TbTrash />}
                  colorScheme="red"
                  aria-label="Delete"
                  onClick={() => handleDeleteQuiz(rowData.id)}
                />
              </Tooltip>
            </HStack>
          )}
        />
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
  const [subjects, setSubjects] = useState([])
  const [selectedSubject, setSelectedSubject] = useState("All")
  const [departments, setDepartments] = useState([])
  const [selectedDepartment, setSelectedDepartment] = useState("All")
  const [selectedModule, setSelectedModule] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [paginationPage, setPaginationPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  // check if selected
  const CheckIfSelected = (qid) => {
    if (questionSet.some((q) => q.id === qid)) {
      return true;
    } else {
      return false;
    }
  }

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
        setQuizzes(data);
      })
      .catch(console.error);
  };

  // initialize datatable
  useEffect(() => {
    fetchQuizzes()
  }, [])

  //populate subject and department select element
  useEffect(() => {
    if (!isOpen) return;

    if (usertype === "Admin") {
      axios.get(`${import.meta.env.VITE_API_HOST}SubjectRoute.php`, { params: { action: "GetAllSubjects", type: usertype } })
        .then(({ data }) => {
          const subjects = data.map(subject => subject.name);
          subjects.unshift("All");
          setSubjects(subjects);
          setSelectedSubject(subjects[0]);
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
          departments.unshift("All");
          setDepartments(departments);
          setSelectedDepartment(departments[0]);
        })
        .catch(console.error);
    } else {
      setDepartments(parsedDepartments);
      setSelectedDepartment(parsedDepartments[0]);
    }
  }, [isOpen])

  // change available quiz based on selected department and subject
  useEffect(() => {
    if (!isOpen) return;

    axios.get(`${import.meta.env.VITE_API_HOST}QuizRoute.php?action=get_available_questions`, {
      params: {
        department: selectedDepartment,
        subject: selectedSubject,
        module: selectedModule,
        category: selectedCategory,
        page: paginationPage,
        limit: 15,
      }
    })
      .then(response => {
        console.log(response)
        setAvailableQuestions(response.data.questions);
        setTotalPages(Math.ceil(response.data.total / 10))
      })
      .catch(console.error);
  }, [isOpen, selectedDepartment, selectedSubject, selectedModule, selectedCategory, paginationPage])

  // Create Quiz
  const handleCreateQuiz = () => {
    if (questionSet.length === 0) {
      alert("Please insert atleast 1 question to create quiz.");
      return;
    }

    onClose()

    let url = ""

    if (isEditing) {
      url = `${import.meta.env.VITE_API_HOST}QuizRoute.php?action=update`
    } else {
      url = `${import.meta.env.VITE_API_HOST}QuizRoute.php?action=create`
    }

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
          id: selectedId,
          quiz_name: quizName,
          subject: selectedSubject,
          department: selectedDepartment,
          questions: questionSet,
          created_by: fullname,
          usertype: usertype,
          user_department: JSON.parse(user_assigned_department)[0]
        };

        axios.post(url, data, {
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
            setQuizName("")
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
      } else {
        onOpen()
      }
    });
  };

  return (
    <>
      {isOpen && (
        <Modal size="full" isOpen={isOpen} onClose={() => { onClose(); setIsEditing(false) }}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <Heading size="lg">{isEditing ? "Edit Quiz" : "Create Quiz"}</Heading>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <SimpleGrid gap={4} columns={3}>
                <Stack>
                  <Heading size="md">Preview</Heading>
                  <Stack backgroundColor="gray.200" maxH="80dvh" overflowY="auto">
                    {questionSet.map((item, index) => (
                      <Card key={index} mx={2} my={1}>
                        <CardBody>
                          <Stack spacing={4}>
                            <Flex direction="row">
                              <Text fontSize="14px" fontWeight="semibold" mr="auto">
                                {index + 1}. {item.question}
                              </Text>
                              <Text fontWeight="semibold" fontSize="10px" mr={2}>
                                {item.classification}
                              </Text>
                              <Button size="xs" mr={1} onClick={() => moveItem(index, -1, setQuestionSet)} isDisabled={index === 0}>
                                <Icon as={TbArrowUp} />
                              </Button>
                              <Button size="xs" mr={1} onClick={() => moveItem(index, 1, setQuestionSet)} isDisabled={index === questionSet.length - 1}>
                                <Icon as={TbArrowDown} />
                              </Button>
                              <Button size="xs" colorScheme="red" onClick={() => deleteItem(item.id, setQuestionSet)}>
                                <Icon as={TbTrash} />
                              </Button>
                            </Flex>
                            <QuizChoices options={item.options} category={item.category} />
                          </Stack>
                        </CardBody>
                      </Card>
                    ))}
                  </Stack>
                </Stack>

                {/* QUESTION LIST */}
                <Stack>
                  <Heading size="md">Available Questions</Heading>
                  <Stack>
                    {availableQuestions.length > 0 ? (
                      availableQuestions.map((item, index) => (
                        <Flex direction="row" key={index} align="center" mb={2}>
                          <Checkbox
                            mr={4}
                            onChange={() => handleCheckboxChange(item.id)}
                            isChecked={CheckIfSelected(item.id)}
                          />
                          <Text fontWeight="semibold">{item.question}</Text>
                          <Tag ml="auto" mr={2} size="sm">
                            {item.category}
                          </Tag>
                          <Tag size="sm">
                            {item.module}
                          </Tag>
                        </Flex>
                      ))
                    ) : (
                      <Text>No questions available</Text>
                    )}
                  </Stack>
                  <HStack spacing={2} mt={4} justify="center">
                    <Button
                      onClick={() => setPaginationPage((prev) => Math.max(prev - 1, 1))}
                      isDisabled={paginationPage === 1}
                    >
                      Previous
                    </Button>
                    <Text>
                      Page {paginationPage} {totalPages ? `of ${totalPages}` : ""}
                    </Text>
                    <Button
                      onClick={() =>
                        setPaginationPage((prev) =>
                          totalPages ? Math.min(prev + 1, totalPages) : prev + 1
                        )
                      }
                      isDisabled={paginationPage === totalPages}
                    >
                      Next
                    </Button>
                  </HStack>
                </Stack>

                {/* INFO */}
                <Stack>
                  <Heading size="md">Info</Heading>
                  <FormControl mt={2}>
                    <FormLabel>Quiz Name</FormLabel>
                    <Input
                      value={quizName}
                      onChange={(e) => setQuizName(e.currentTarget.value)}
                      placeholder="Mathematics short quiz 1"
                    />
                  </FormControl>
                  <FormControl mt={2}>
                    <FormLabel>Subject</FormLabel>
                    <Select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                      {subjects.map((subject, index) => (
                        <option key={index} value={subject}>{subject}</option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl mt={2}>
                    <FormLabel>Department</FormLabel>
                    <Select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
                      {departments.map((department, index) => (
                        <option key={index} value={department}>{department}</option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl mt={2}>
                    <FormLabel>Category</FormLabel>
                    <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                      {["All", "Identification", "Numeric", "True/False", "Multiple"].map((department, index) => (
                        <option key={index} value={department}>{department}</option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl mt={2}>
                    <FormLabel>Module Number</FormLabel>
                    <Select value={selectedModule} onChange={(e) => setSelectedModule(e.target.value)}>
                      {["All",
                        "Module 1",
                        "Module 2",
                        "Module 3",
                        "Module 4",
                        "Module 5",
                        "Module 6",
                        "Module 7",
                        "Module 8",
                        "Module 9",
                        "Module 10"].map((department, index) => (
                          <option key={index} value={department}>{department}</option>
                        ))}
                    </Select>
                  </FormControl>
                </Stack>
              </SimpleGrid>
            </ModalBody>

            <ModalFooter>
              <Button mr={4} onClick={onClose}>Close</Button>
              <Button onClick={handleCreateQuiz} rightIcon={<BiCheck />} colorScheme="green">
                {isEditing ? "Save Changes" : "Create Quiz"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
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
              setSelectedId={setSelectedId}
              setIsEditing={setIsEditing}
              setQuestionSet={setQuestionSet}
              setQuizName={setQuizName}
              data={quizzes}
              refreshTable={fetchQuizzes}
              openCreateQuiz={onOpen}
            />
          </CardBody>
        </Card>
      </Stack>
    </>
  );
}