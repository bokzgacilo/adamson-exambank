import { Input, Radio, RadioGroup, Stack, Flex, Textarea, Card, CardBody, Text, Tag, HStack, CardHeader, Tooltip, IconButton } from "@chakra-ui/react";
import { TbArrowDown, TbArrowUp, TbTrash, TbTrashFilled } from "react-icons/tb";
import { deleteItem, moveItem } from "../../helper/main";

export default function ExamQuestionPreviewCard({ item_id, options, category, update, question, item_number, classification }) {

  const renderCardQuestion = (options, category) => {
    switch (category) {
      case "Identification": {
        return (
          <Input value={JSON.parse(options)[0].option} readOnly />
        );
      }
      case "Enumeration": {
        const TextAreaValue = JSON.parse(options)
          .map((item) => item.option)
          .join("\n");

        return (
          <Textarea
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
              {JSON.parse(options).map((option, index) => (
                <Radio key={index} isChecked={option.is_correct}>
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
            <Stack spacing={4}>
              {JSON.parse(options).map((option, index) => (
                <Flex
                  key={index}
                  direction="row"
                  alignItems="center"
                  gap={4}
                >
                  <Radio isChecked={option.is_correct} />
                  <Input type="text" value={option.option} readOnly />
                </Flex>
              ))}
            </Stack>
          </RadioGroup>
        );
      default:
        return null;
    }
  }

  return (
    <Card>
      <CardHeader backgroundColor="gray.100">
        <HStack>
          <Text fontSize="14px" >
            {item_number + 1}.
          </Text>
          <Text fontWeight="semibold" noOfLines={2} mr="auto">{question}</Text>
          <Tag fontWeight="semibold" fontSize="12px" mr={2}>
            {classification}
          </Tag>
          <Tooltip label="Move Up">
            <IconButton onClick={() => moveItem(item_number, -1, update)} icon={<TbArrowUp />} size="sm" />
          </Tooltip>
          <Tooltip label="Move Down">
            <IconButton onClick={() => moveItem(item_number, 1, update)} icon={<TbArrowDown />} size="sm" />
          </Tooltip>
          <Tooltip label="Remove">
            <IconButton onClick={() => deleteItem(item_id, update)} icon={<TbTrashFilled />} colorScheme="red" size="sm" />
          </Tooltip>
        </HStack>
      </CardHeader>
      <CardBody>
        {renderCardQuestion(options, category)}
      </CardBody>
    </Card>
  )
}