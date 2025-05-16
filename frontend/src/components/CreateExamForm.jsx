import {
  Button,
  Stack,
  Text,
  Input,
  Heading,
  SimpleGrid,
  Select,
  Flex,
  Textarea,
  RadioGroup,
  Checkbox,
  Radio,
  Card,
  CardBody,
  Tag,
  Icon,
  HStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { TbArrowDown, TbArrowUp, TbTrash } from "react-icons/tb";
import useUserStore from "../helper/useUserStore";

CreateExamForm.propTypes = {
  TOS: PropTypes.array.isRequired,
  SelectedSubject: PropTypes.string.isRequired,
  QuestionSet: PropTypes.array.isRequired,
  SetQuestionSet: PropTypes.func.isRequired,
  AccessCode: PropTypes.string.isRequired,
};

export default function CreateExamForm({ AccessCode, SelectedSubject, TOS, QuestionSet, SetQuestionSet }) {
  const { user } = useUserStore()
  const [Questions, SetQuestions] = useState([]);
  const [departments, setDepartments] = useState([])
  const [filteredClassification, setFilteredClassification] = useState("");
  const [filteredCategory, setFilteredCategory] = useState('');
  const [filteredTerm, setFilteredTerm] = useState("")

  const [selectedDepartment, setSelectedDepartment] = useState("")
  const parsedDepartment = JSON.parse(user.user_assigned_department)

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

  const filteredQuestions = Questions.filter((q) => {
    const matchClassification =
      filteredClassification === '' || q.classification === filteredClassification;

    const matchCategory =
      filteredCategory === '' || q.category === filteredCategory;

    const matchDepartment =
      selectedDepartment === 'All' || q.department === selectedDepartment;

    let matchTerm = true;
    if (filteredTerm !== '') {
      if (q.terms && q.terms.startsWith('[')) {
        try {
          const termArray = JSON.parse(q.terms);
          matchTerm = termArray.includes(filteredTerm);
        } catch (e) {
          matchTerm = false;
        }
      } else {
        matchTerm = false;
      }
    }
    return matchClassification && matchCategory && matchDepartment && matchTerm;
  });


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

    const GetAllQuestions = () => {
      axios
        .post(
          `${import.meta.env.VITE_API_HOST}QuestionRoute.php?action=QuestionForBank`,
          {
            subject: SelectedSubject
          }
        )
        .then((response) => {
          SetQuestions(response.data);
        });
    };

    GetAllSubjects();
    GetAllQuestions();
  }, []);

  const categoryCounts = QuestionSet.reduce((acc, item) => {
    const categoryKey = item.classification;
    acc[categoryKey] = (acc[categoryKey] || 0) + 1;
    return acc;
  }, {});

  const moveItem = (index, direction) => {
    SetQuestionSet((prevItems) => {
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

  const CheckIfSelected = (qid) => {
    if (QuestionSet.some((q) => q.id === qid)) {
      return true;
    } else {
      return false;
    }
  }

  const handleDelete = (id) => {
    SetQuestionSet((prevSet) => prevSet.filter((item) => item.id !== id));
  };

  return (
    <SimpleGrid templateColumns="40% 1fr 1fr" gap={4}>
      <Stack
        backgroundColor="#fbfbfb"
        p={4}
        overflowY="auto"
        maxH="calc(100vh - 150px)"
        w="100%"
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
                      isDisabled={index === QuestionSet.length - 1}
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
          ))
        )}
      </Stack>
      <Stack>
        <Heading size="md">Metadata</Heading>
        <Text fontWeight="semibold">Access Code</Text>
        <Input type="text" mb={2} value={AccessCode} disabled />
        <Text fontWeight="semibold">Classifications</Text>
        {Object.entries(TOS).map(([category, expected]) => {
          if (expected === 0) return null;

          const count = categoryCounts[category] || 0;
          return (
            <Flex
              key={category}
              alignItems="center"
              justifyContent="space-between"
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

      <Stack>
        <Heading size="md">Question Bank</Heading>
        <Heading size="md">Sort By</Heading>
        <HStack>
          <Stack>
            <Text fontWeight="semibold">Classification</Text>
            <Select
              onChange={(e) => setFilteredClassification(e.target.value)}
            >
              <option value="">All</option>
              <option value="Knowledge">Knowledge</option>
              <option value="Comprehension">Comprehension</option>
              <option value="Application">Application</option>
              <option value="Evaluation">Evaluation</option>
              <option value="Analysis">Analysis</option>
              <option value="Synthesis">Synthesis</option>
            </Select>
          </Stack>
          <Stack>
            <Text fontWeight="semibold">Category</Text>
            <Select
              value={filteredCategory}
              onChange={(e) => setFilteredCategory(e.target.value)}
            >
              <option value="">All</option>
              <option value="Multiple">Multiple Choice</option>
              <option value="Numeric">Numeric</option>
              <option value="Identification">Identification</option>
              <option value="True/False">True/False</option>
            </Select>
          </Stack>
          <Stack>
            <Text fontWeight="semibold">Department</Text>
            <Select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
              {departments.map((department, index) => (
                <option key={index} value={department.name || department}>{department.name || department}</option>
              ))}
            </Select>
          </Stack>
          <Stack>
            <Text fontWeight="semibold">Term</Text>
            <Select
              value={filteredTerm}
              onChange={(e) => setFilteredTerm(e.target.value)}
            >
              <option value="">All</option>
              <option value="Prelims">Prelims</option>
              <option value="Midterms">Midterms</option>
              <option value="Finals">Finals</option>
            </Select>
          </Stack>
        </HStack>
        <Stack spacing={2} overflowY="auto" maxH="calc(100vh - 280px)" w="100%">
          {filteredQuestions.map((item) => (
            <Flex direction="row" key={item.id}>
              <Checkbox
                key={item.id}
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
      </Stack>
    </SimpleGrid>
  );
}
