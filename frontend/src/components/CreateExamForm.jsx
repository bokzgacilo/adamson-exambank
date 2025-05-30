import {
  Button,
  Stack,
  Text,
  Input,
  Heading,
  SimpleGrid,
  Select,
  Flex,
  Checkbox,
  Card,
  CardBody,
  Tag,
  HStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import useUserStore from "../helper/useUserStore";
import ExamQuestionPreviewCard from "./composites/ExamQuestionPreviewCard";

export default function CreateExamForm({ AccessCode, SelectedSubject, TOS, QuestionSet, SetQuestionSet }) {
  const { user } = useUserStore()
  const [Questions, SetQuestions] = useState([]);
  const [departments, setDepartments] = useState([])
  const [filteredClassification, setFilteredClassification] = useState("");
  const [filteredCategory, setFilteredCategory] = useState('');
  const [filteredTerm, setFilteredTerm] = useState("")

  const [selectedDepartment, setSelectedDepartment] = useState("")
  const parsedDepartment = JSON.parse(user.user_assigned_department)

  const [paginationPage, setPaginationPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // GET ALL QUESTIONS WITH PAGINATION [START]
  const GetAllQuestions = () => {
    axios.post(`${import.meta.env.VITE_API_HOST}QuestionRoute.php?action=get_all_questions_with_pagination`, {
      subject: SelectedSubject,
      page: paginationPage,
      limit: 15,
      classification: filteredClassification || "All",
      category: filteredCategory || "All",
      term: filteredTerm || "All",
      department: selectedDepartment || "All"
    }).then((response) => {
      console.log(response)
      SetQuestions(response.data.questions);
      setTotalPages(Math.ceil(response.data.total / 10))
    })
  };

  useEffect(() => GetAllQuestions(), [paginationPage, filteredClassification, filteredCategory, filteredTerm, selectedDepartment])
  // [END]

  useEffect(() => {
    if (user.usertype === "Admin") {
      axios.get(`${import.meta.env.VITE_API_HOST}SubjectRoute.php`, { params: { action: "GetAllDepartments", type: user.usertype } })
        .then(({ data }) => {
          const departmentsWithAll = [{ name: "All" }, ...data];
          setDepartments(departmentsWithAll);
          setSelectedDepartment("All");
        })
        .catch(console.error);
    } else {
      setDepartments(parsedDepartment)
      setSelectedDepartment(parsedDepartment[0])
    }
  }, [])

  const [, SetSubjects] = useState([]);

  const handleCheckboxChange = (id) => {
    SetQuestionSet((prevItems) => {
      const isAlreadySelected = prevItems.some((item) => item.id === id);

      if (isAlreadySelected) {
        return prevItems.filter((item) => item.id !== id);
      } else {
        return [...prevItems, Questions.find((q) => q.id === id)];
      }
    });
  };

  useEffect(() => {
    const fetchData = async (method, url, setter, body = null) => {
      try {
        const { data } = await axios({
          method: method.toLowerCase(),
          url,
          ...(body && { data: body }),
        });
        setter(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }

    };

    const GetAllSubjects = () =>
      fetchData(
        "GET",
        `${import.meta.env.VITE_API_HOST}SubjectRoute.php?action=viewAll`,
        SetSubjects
      );

    GetAllSubjects();
  }, []);

  const categoryCounts = QuestionSet.reduce((acc, item) => {
    const categoryKey = item.classification;
    acc[categoryKey] = (acc[categoryKey] || 0) + 1;
    return acc;
  }, {});

  const CheckIfSelected = (qid) => {
    if (QuestionSet.some((q) => q.id === qid)) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <SimpleGrid templateColumns="40% 1fr 20%" gap={4}>
      <Stack
        backgroundColor="gray.300"
        p={2}
        spacing={3}
        overflowY="auto"
        maxHeight="80dvh"
      >
        {QuestionSet.length === 0 ? (
          <Card>
            <CardBody>
              <Stack spacing={4} textAlign="center">
                <Text fontSize="lg" fontWeight="semibold">
                  No Question in this exam.
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Add a question to get started.
                </Text>
              </Stack>
            </CardBody>
          </Card>
        ) : (
          QuestionSet.map((item, index) => (
            <ExamQuestionPreviewCard
              key={index}
              item_id={item.id}
              item_number={index}
              question={item.question}
              classification={item.classification}
              module_number={item.module}
              options={item.options}
              category={item.category}
              update={SetQuestionSet}
            />
          ))
        )}
      </Stack>
      <Stack
        maxHeight="80dvh"
      >
        <Heading size="md" mb={4}>Available Exam Question</Heading>
        <Heading size="md" mb={4}>Sort By</Heading>
        <HStack mb={4}>
          <Stack>
            <Text fontWeight="semibold">Classification</Text>
            <Select
              onChange={(e) => {
                setFilteredClassification(e.target.value)
                setPaginationPage(1)
              }}
            >
              {["All", "Knowledge", "Comprehension", "Application", "Evaluation", "Analysis", "Synthesis"].map((item, index) => (
                <option key={index} value={item}>{item}</option>
              ))}
            </Select>
          </Stack>
          <Stack>
            <Text fontWeight="semibold">Category</Text>
            <Select
              value={filteredCategory}
              onChange={(e) => {
                setFilteredCategory(e.target.value)
                setPaginationPage(1)
              }}
            >
              {["All", "Multiple", "Numeric", "Identification", "True/False"].map((item, index) => (
                <option key={index} value={item}>{item}</option>
              ))}
            </Select>
          </Stack>
          <Stack>
            <Text fontWeight="semibold">Department</Text>
            <Select value={selectedDepartment} onChange={(e) => {
              setSelectedDepartment(e.target.value)
              setPaginationPage(1)
            }}>
              {departments.map((department, index) => (
                <option key={index} value={department.name || department}>{department.name || department}</option>
              ))}
            </Select>
          </Stack>
          <Stack>
            <Text fontWeight="semibold">Term</Text>
            <Select
              value={filteredTerm}
              onChange={(e) => {
                setFilteredTerm(e.target.value)
                setPaginationPage(1)
              }}
            >
              {["All", "Prelims", "Midterms", "Finals", "Departmental Exam"].map((item, index) => (
                <option key={index} value={item}>{item}</option>
              ))}
            </Select>
          </Stack>
        </HStack>
        <Stack spacing={4} overflowY="auto">
          {Questions.map((item, index) => (
            <Flex direction="row" key={index}>
              <Checkbox
                mr={4}
                onChange={() => handleCheckboxChange(item.id)}
                isChecked={CheckIfSelected(item.id)}
                isDisabled={
                  TOS[item.classification] === 0 ||
                  (categoryCounts[item.classification] >= TOS[item.classification] && !CheckIfSelected(item.id))
                }
              />
              <Text fontWeight="semibold">{item.question}</Text>
              <Tag ml="auto" size="sm">
                {item.category}
              </Tag>
            </Flex>
          ))}
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

      <Stack
        maxHeight="80dvh"
      >
        <Heading size="md">Metadata</Heading>
        <Text fontWeight="semibold">Access Code</Text>
        <Input type="text" mb={2} value={AccessCode} disabled />
        <Text fontWeight="semibold">Classifications</Text>
        {Object.entries(TOS).map(([category, expected], index) => {
          if (expected === 0) return null;

          const count = categoryCounts[category] || 0;
          return (
            <Flex
              alignItems="center"
              justifyContent="space-between"
              key={index}
            >
              <Text fontWeight="semibold">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
              <Text color={count >= expected ? "green.500" : "red.500"}>
                {count} of {expected} Selected
              </Text>
            </Flex>
          );
        })}
      </Stack>
    </SimpleGrid>
  );
}
