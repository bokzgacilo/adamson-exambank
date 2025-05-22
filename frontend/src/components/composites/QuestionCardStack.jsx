import { Input, Radio, RadioGroup, Stack, Flex, Textarea, Card } from "@chakra-ui/react";

export default function QuestionCardStack({ options, category }) {
    switch (category) {
      case "Identification": {
        return (
          <Input value={JSON.parse(options)[0].option} readOnly />
        );
      }
      case "True/False": {
        return (
          <RadioGroup>
            <Stack spacing={2}>
              {JSON.parse(options).map((option, index) => (
                <Radio key={index} isChecked={option.is_correct}>
                  {option.option}
                </Radio>
              ))}
            </Stack>
          </RadioGroup>
        );
      }
      case "Numeric": {
        return (
          <Input size="sm" value={JSON.parse(options)[0].option} readOnly />
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
                  <Input size="sm" type="text" value={option.option} readOnly />
                </Flex>
              ))}
            </Stack>
          </RadioGroup>
        );
      default:
        return null;
    }
}