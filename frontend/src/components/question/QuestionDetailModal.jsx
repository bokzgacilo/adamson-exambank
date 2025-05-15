import {
  Stack,
  Radio,
  RadioGroup,
  Flex,
  Text,
  Textarea,
  Input,
  SimpleGrid,
  Heading,
  Checkbox,
  HStack,
  FormControl,
  FormLabel,
  Divider,
  Tag,
  Box
} from "@chakra-ui/react";

import { useState } from "react";

export default function QuestionDetailModal({ QuestionData }) {
  const [MultipleChoices, ] = useState(() => {
    try {
      return QuestionData.options ? JSON.parse(QuestionData.options) : [];
    } catch (error) {
      console.error("Error parsing options:", error);
      return [];
    }
  });

  const renderFormElement = () => {
    switch (QuestionData.category) {
      case "Numeric":
        return <Input disabled type="number" value={MultipleChoices[0].option} />;
      case "Identification":
        return <Input disabled type="text" value={MultipleChoices[0].option} />;
      case "Enumeration":
        return (
          <>
            <Text>Separate answers by new line</Text>
            <Textarea isDisabled placeholder="Enter answers" value={MultipleChoices.map(choice => choice.option).join("\n")} />
          </>
        );
      case "True/False":
        return (
          <RadioGroup>
            <Stack spacing={4}>
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
                  <Checkbox size="lg" disabled isChecked={option.is_correct} />
                  <Input readOnly type="text" value={option.option} />
                </Flex>
              ))}
            </Stack>
          </RadioGroup>
        );
      default:
        return null;
    }
  };

  return (
    <Stack spacing={4}>
      <FormControl>
        <FormLabel>Question</FormLabel>
        <Input value={QuestionData.question} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Subject</FormLabel>
        <Input value={QuestionData.subject} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Department</FormLabel>
        <Input value={QuestionData.department} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Terms</FormLabel>
        <HStack justifyContent="space-evenly">
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
      </FormControl>
      <FormControl>
        <FormLabel>Classification</FormLabel>
        <Input value={QuestionData.classification} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Category</FormLabel>
        <Input value={QuestionData.category} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Choices and Answers</FormLabel>
        {renderFormElement()}
      </FormControl>
      <Divider />
      <Stack>
        <SimpleGrid columns={2}>
          <Heading size="sm">Created By</Heading>
          <Text>{QuestionData.created_by?.trim() ? QuestionData.created_by : "No creator"}</Text>
        </SimpleGrid>
        <SimpleGrid columns={2}>
          <Heading size="sm">Date Created</Heading>
          <Text>{QuestionData.date_created}</Text>
        </SimpleGrid>
        <SimpleGrid columns={2}>
          <Heading size="sm">Status</Heading>
          <Box>
            <Tag colorScheme={QuestionData.status === 1 ? "green" : "red"}>
              {QuestionData.status === 1 ? "Active" : "Inactive"}
            </Tag>
          </Box>
        </SimpleGrid>
      </Stack>
    </Stack>
  );
}
