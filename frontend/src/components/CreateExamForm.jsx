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
  Divider,
  HStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

import PropTypes from "prop-types";
import useUserStore from "../helper/useUserStore";
import { TbArrowDown, TbArrowUp } from "react-icons/tb";

CreateExamForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default function CreateExamForm({TOS, QuestionSet, SetQuestionSet}) {
  const AccessCode = Math.floor(100000 + Math.random() * 900000);
  const [Questions, SetQuestions] = useState([]);
  const [ExamName, SetExamName] = useState("");
  const { user_assigned_subject } = useUserStore(
    (state) => state.user
  );
  const [Subject, SetSubject] = useState(
    user_assigned_subject !== "none" ? user_assigned_subject : "Math"
  );

  // const data = {
  //   exam_name: ExamName,
  //   subject: Subject,
  //   access_code: AccessCode,
  //   questions: QuestionSet,
  //   created_by: fullname,
  // };

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
    console.log(QuestionSet)
    axios
      .get(
        `http://localhost/exam-bank/api/ExamRoute.php?action=getAllQuestion&subject=${user_assigned_subject}`
      )
      .then((response) => {
        SetQuestions(response.data);
      });
  }, [QuestionSet]);

  const UserSubject = () => {
    switch (localStorage.getItem("usertype")) {
      case "Instructor":
        return (
          <Input
            size="sm"
            type="text"
            value={localStorage.getItem("usersubject")}
            isReadOnly
            mb={4}
          />
        );
      default:
        return (
          <Select
            size="sm"
            mb={4}
            value={Subject}
            onChange={(e) => SetSubject(e.target.value)}
          >
            <option>Programming Language II</option>
            <option>Math</option>
            <option>Computer Programming</option>
          </Select>
        );
    }
  };

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
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...new Set(Questions.map((q) => q.classification))];

  const filteredQuestions =
    selectedCategory === "All"
      ? Questions
      : Questions.filter((q) => q.classification === selectedCategory);

  const categoryCounts = QuestionSet.reduce((acc, item) => {
    const categoryKey = item.category; // Normalize case
    acc[categoryKey] = (acc[categoryKey] || 0) + 1;
    return acc;
  }, {});

  return (
    <SimpleGrid templateColumns="1fr 1fr" gap={4}>
      <Stack backgroundColor="#fbfbfb" p={4}>
        {QuestionSet.map((item, index) => (
          <Card key={item.id}>
            <CardBody>
              <Stack spacing={4}>
                <Flex direction="row">
                  <Text fontWeight="semibold" mr="auto">
                    {index + 1}. {item.question} : {item.classification}
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
        <Input
          size="sm"
          type="text"
          mb={2}
          value={AccessCode}
          disabled
        />
        <Text fontWeight="semibold">NAME</Text>
        <Input
          size="sm"
          type="text"
          mb={2}
          value={ExamName}
          onChange={(e) => SetExamName(e.currentTarget.value)}
        />
        <Text fontWeight="semibold">SUBJECT</Text>
        {UserSubject()}
        <Divider />
        <Flex direction="row" justifyContent="space-between">
          <Heading size="md" mb={2}>
            BANK
          </Heading>
          <Text>{Questions.length}</Text>
        </Flex>
        <Text fontWeight="semibold">TOS</Text>
        {Object.entries(TOS).map(([category, expected]) => {
          const count = categoryCounts[category] || 0;
          return (
            <Flex
              key={category}
              alignItems="center"
              justifyContent="space-between"
            >
              <Text fontWeight="bold">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
              <Text color={count >= expected ? "green.500" : "red.500"}>
                {count} of {expected} Selected
              </Text>
            </Flex>
          );
        })}
        <Text mt={4} fontWeight="semibold">SORT BY CLASSIFICATION</Text>
        <Stack spacing={4}>
          <Select
            size="sm"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            mb={4}
          >
            {categories.map((classification) => (
              <option key={classification} value={classification}>
                {classification}
              </option>
            ))}
          </Select>

          <Stack spacing={2}>
            {filteredQuestions.map((item) => (
              <Flex direction="row" key={item.id}>
                <Checkbox
                  key={item.id}
                  mr={4}
                  onChange={() => handleCheckboxChange(item.id)}
                  isChecked={QuestionSet.some((q) => q.id === item.id)}
                />
                <Text fontWeight="semibold">{item.question}</Text>
                <Tag ml="auto" size="sm">
                  {item.category}
                </Tag>
              </Flex>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </SimpleGrid>
  );
}
