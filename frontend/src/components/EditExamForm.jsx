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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { TbArrowDown, TbArrowUp } from "react-icons/tb";

EditExamForm.propTypes = {
  data: PropTypes.array.isRequired,
  isOpen: PropTypes.func.isRequired,
  refreshData: PropTypes.func.isRequired,
  onClose: PropTypes.array.isRequired,
};

export default function EditExamForm({ refreshData, data, isOpen, onClose }) {
  const AccessCode = data.access_code;
  const TOS = JSON.parse(data.tos);
  const SelectedSubject = data.subject;
  const toast = useToast();
  const [QuestionSet, SetQuestionSet] = useState(JSON.parse(data.questions));
  const [Questions, SetQuestions] = useState(JSON.parse(data.questions));
  const [filteredClassification, setFilteredClassification] = useState("");
  const [filteredCategory, setFilteredCategory] = useState('');
  const filteredQuestions = Questions.filter((q) => {
    const matchClassification = filteredClassification === '' || q.classification === filteredClassification;
    const matchCategory = filteredCategory === '' || q.category === filteredCategory;
    return matchClassification && matchCategory;
  });

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
    const GetAllQuestions = () => {
      axios
        .post(
          `http://localhost/exam-bank/api/QuestionRoute.php?action=QuestionForBank`,
          {
            subject: SelectedSubject,
          }
        )
        .then((response) => {
          SetQuestions(response.data);
        });
    };

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
  };

  const HandleSaveChanges = () => {
    const totalSum = Object.values(TOS)
      .map(Number)
      .reduce((sum, value) => sum + value, 0);

    const updateQuestions = {
      examid: data.id,
      questions: QuestionSet
    };

    if (totalSum === QuestionSet.length) {
      axios
        .post(
          "http://localhost/exam-bank/api/ExamRoute.php?action=update",
          updateQuestions
        )
        .then((response) => {
          console.log(response.data);
          // FIREBASE CREATE EXAM
        })
        .catch((error) => {
          console.error("Error:", error);
        })
        .finally(() => {
          onClose();

          toast({
            title: `${data.exam_name} Updated!`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });

          refreshData()
        });
    } else {
      alert("INCOMPLETE");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading size="lg">Edit Exam</Heading>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
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
              <Text fontWeight="semibold">SORT BY CATEGORY</Text>
              <Select
                size="sm"
                value={filteredCategory}
                onChange={(e) => setFilteredCategory(e.target.value)}
                mb={4}
              >
                <option value="">All</option>
                <option value="Multiple">Multiple Choice</option>
                <option value="Numeric">Numeric</option>
                <option value="Identification">Identification</option>
                <option value="True/False">True/False</option>
              </Select>
              <Stack
                spacing={2}
                overflowY="auto"
                maxH="calc(100vh - 280px)"
                w="100%"
              >
                {filteredQuestions.map((item) => (
                  <Flex direction="row" key={item.id}>
                    <Checkbox
                      key={item.id}
                      mr={4}
                      onChange={() => handleCheckboxChange(item.id)}
                      isChecked={CheckIfSelected(item.id)}
                      isDisabled={
                        categoryCounts[item.classification] >=
                          TOS[item.classification] && !CheckIfSelected(item.id)
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
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={HandleSaveChanges}>Save Changes</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
