import { Input, Textarea, RadioGroup, Radio, HStack, Checkbox, Flex } from "@chakra-ui/react";

export default function QuizChoices({options, category}) {
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
          <HStack spacing={4}>
            {JSON.parse(options).map((option, index) => (
              <Flex
                key={index}
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
}