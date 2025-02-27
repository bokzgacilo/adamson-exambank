import {
  Stack,
  Radio,
  RadioGroup,
  Flex,
  Text,
  Textarea,
  Input,
  SimpleGrid,
  Select,
  Checkbox,
  HStack,
} from "@chakra-ui/react";

import PropTypes from "prop-types";
import { useState } from "react";

QuestionDetail.propTypes = {
  QuestionData: PropTypes.any.isRequired,
};

export default function QuestionDetail({ QuestionData }) {

  const [MultipleChoices, SetMultipleChoices] = useState(() => {
    try {
      return QuestionData.options ? JSON.parse(QuestionData.options) : [];
    } catch (error) {
      console.error("Error parsing options:", error);
      return [];
    }
  });

  const renderFormElement = () => {
    switch (QuestionData.category) {
      case "Identification":
        return <Input size="sm" disabled type="text" value={MultipleChoices[0].option} />;
      case "Enumeration":
        return (
          <>
            <Text>Separate answers by new line</Text>
            <Textarea size="sm" isDisabled placeholder="Enter answers" value={MultipleChoices.map(choice => choice.option).join("\n")} />
          </>
        );
      case "True/False":
        return (
          <RadioGroup>
            <Stack spacing={2}>
              {MultipleChoices.map((option) => (
                <Radio disabled key={option.id} isChecked={option.is_correct}>
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
                  <Checkbox disabled isChecked={option.is_correct} />
                  <Input size="sm" readOnly type="text" value={option.option} />
                </Flex>
              ))}
            </Stack>
          </RadioGroup>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    const formattedTime = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  
    return `${formattedDate} - ${formattedTime}`;
  };

  return (
    <Stack>
      <Text fontWeight="semibold">SUBJECT</Text>
      <Input size="sm"  value={QuestionData.subject} readOnly name="subject" mb={4} />

      <Text fontWeight="semibold">QUESTION</Text>
      <Input size="sm" value={QuestionData.question} readOnly name="question" mb={4} />

      <Text fontWeight="semibold">TERMS</Text>
      <HStack justifyContent="space-evenly" mb={4}>
        <Checkbox isChecked={QuestionData.terms.includes("Prelims")}>
          Prelims
        </Checkbox>
        <Checkbox isChecked={QuestionData.terms.includes("Midterms")}>
          Midterms
        </Checkbox>
        <Checkbox isChecked={QuestionData.terms.includes("Finals")}>
          Finals
        </Checkbox>
      </HStack>

      <Text fontWeight="semibold">CLASSIFICATION</Text>
      <Select size="sm" value={QuestionData.classification} isDisabled mb={4}>
        <option value="Knowledge">Knowledge</option>
        <option value="Comprehension">Comprehension</option>
        <option value="Application">Application</option>
        <option value="Analysis">Analysis</option>
        <option value="Synthesis">Synthesis</option>
        <option value="Evaluation">Evaluation</option>
      </Select>

      <Text fontWeight="semibold">CATEGORY</Text>
      <Select size="sm" value={QuestionData.category} isDisabled mb={4}>
        <option value="Identification">Identification</option>
        <option value="Enumeration">Enumeration</option>
        <option value="True/False">True/False</option>
        <option value="Multiple">Multiple Choice</option>
      </Select>

      <Text fontWeight="semibold">OPTIONS / CORRECT ANSWER</Text>
      {renderFormElement()}

      <Stack mb={4} mt={8} spacing={2}>
        <SimpleGrid alignItems="center" templateColumns="40% 60%">
          <Text>Created By</Text>
          <Text>{QuestionData.created_by}</Text>
        </SimpleGrid>
        <SimpleGrid alignItems="center" templateColumns="40% 60%">
          <Text>Date Created</Text>
          <Text>{formatDate(QuestionData.date_created)}</Text>
        </SimpleGrid>
        <SimpleGrid alignItems="center" templateColumns="40% 60%">
          <Text>Last Updated</Text>
          <Text>{formatDate(QuestionData.last_updated)}</Text>
        </SimpleGrid>
      </Stack>
    </Stack>
  );
}
