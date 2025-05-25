import {
  Stack,
  Text,
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

import QuestionChoices from "../composites/QuestionChoices";

export default function QuestionDetailModal({ QuestionData, isEditing, isForExam }) {
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

      {isForExam ?
        <>
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
              <Checkbox isChecked={QuestionData.terms.includes("Departmental Exam")}>
                Finals
              </Checkbox>
            </HStack>
          </FormControl>
          <FormControl>
            <FormLabel>Module</FormLabel>
            <Input value={QuestionData.module} readOnly />
          </FormControl>
          <FormControl>
            <FormLabel>Classification</FormLabel>
            <Input value={QuestionData.classification} readOnly />
          </FormControl>
        </>

        :
        <FormControl>
          <FormLabel>Module Number</FormLabel>
          <Input value={QuestionData.module} readOnly />
        </FormControl>
      }
      
      <FormControl>
        <FormLabel>Category</FormLabel>
        <Input value={QuestionData.category} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>Choices and Answers</FormLabel>
        <QuestionChoices isEditing={isEditing} multipleChoices={QuestionData.options} category={QuestionData.category} />
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
            <Tag colorScheme={QuestionData.status == 1 ? "green" : "red"}>
              {QuestionData.status == 1 ? "Active" : "Inactive"}
            </Tag>
          </Box>
        </SimpleGrid>
      </Stack>
    </Stack>
  );
}
