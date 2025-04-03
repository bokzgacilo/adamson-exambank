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
import { TbArrowDown, TbArrowUp } from "react-icons/tb";

CreateExamForm.propTypes = {
  TOS: PropTypes.string.isRequired,
  SelectedSubject: PropTypes.string.isRequired, 
  QuestionSet: PropTypes.array.isRequired, 
  SetQuestionSet: PropTypes.func.isRequired, 
  AccessCode: PropTypes.string.isRequired,
};

export default function CreateExamForm({ AccessCode, SelectedSubject, TOS, QuestionSet, SetQuestionSet }) {
  const [Questions, SetQuestions] = useState([]);
  const [filteredClassification, setFilteredClassification] = useState("");
  const filteredQuestions = Questions.filter(
    (q) =>
      !filteredClassification || q.classification === filteredClassification
  );
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
        "http://localhost/exam-bank/api/SubjectRoute.php?action=viewAll",
        SetSubjects
      );

    const GetAllQuestions = () => {
      axios
        .post(
          `http://localhost/exam-bank/api/QuestionRoute.php?action=QuestionForBank`,
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
    if(QuestionSet.some((q) => q.id === qid)){
      return true;
    }else{
      return false;
    }
  }

  return (
    <SimpleGrid templateColumns="40% 1fr 1fr" gap={4}>
      <Stack
        backgroundColor="#fbfbfb"
        p={4}
        overflowY="auto"
        maxH="calc(100vh - 150px)"
        w="100%"
      >
        {QuestionSet.map((item, index) => (
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
                    onClick={() => moveItem(index, 1)}
                    isDisabled={index === QuestionSet.length - 1}
                  >
                    <Icon as={TbArrowDown} />
                  </Button>
                </Flex>
                {renderFormElement(item.options, item.category)}
              </Stack>
            </CardBody>
          </Card>
        ))}
      </Stack>
      <Stack>
        <Heading size="md">METADATA</Heading>
        <Text fontWeight="semibold">ACCESS CODE</Text>
        <Input size="sm" type="text" mb={2} value={AccessCode} disabled />
        
        <Text fontWeight="semibold">TOS</Text>
        {Object.entries(TOS).map(([category, expected]) => {
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
        <Heading size="md">BANK</Heading>
        <Text fontWeight="semibold">SORT BY CLASSIFICATION</Text>
        <Select
          size="sm"
          onChange={(e) => setFilteredClassification(e.target.value)}
          mb={4}
        >
          <option value="">All</option>
          <option value="Knowledge">Knowledge</option>
          <option value="Comprehension">Comprehension</option>
          <option value="Application">Application</option>
          <option value="Evaluation">Evaluation</option>
          <option value="Analysis">Analysis</option>
          <option value="Synthesis">Synthesis</option>
        </Select>

        <Stack spacing={2} overflowY="auto" maxH="calc(100vh - 280px)" w="100%">
          {filteredQuestions.map((item) => (
            <Flex direction="row" key={item.id}>
              <Checkbox
                key={item.id}
                mr={4}
                onChange={() => handleCheckboxChange(item.id)}
                isChecked={CheckIfSelected(item.id)}
                isDisabled={categoryCounts[item.classification] >= TOS[item.classification] && !CheckIfSelected(item.id)}
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
