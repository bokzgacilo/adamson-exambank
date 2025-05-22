import { Card, CardBody, Stack, Text, Flex, Tag } from "@chakra-ui/react";
import QuizChoices from "./QuizChoices";

export default function QuizQuestionListElement({questionSet}){
  return questionSet.map((item, index) => (
    <Card key={index}>
      <CardBody>
        <Stack spacing={4}>
          <Flex direction="row">
            <Text fontSize="14px" fontWeight="semibold" mr="auto">
              {index + 1}. {item.question}
            </Text>

            <Tag fontWeight="semibold" fontSize="12px" mr={2}>
              {item.category}
            </Tag>
          </Flex>
          <QuizChoices options={item.options} category={item.category} />
        </Stack>
      </CardBody>
    </Card>
  ))
}