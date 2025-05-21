import { Input, Text, RadioGroup, Stack, Radio, Flex, Checkbox } from "@chakra-ui/react";
import { useEffect } from "react";

export default function QuestionChoices({ multipleChoices, setMultipleChoices, category, isEditing }) {
  let choices;

  try {
    choices = Array.isArray(multipleChoices)
      ? multipleChoices
      : JSON.parse(multipleChoices);
  } catch (e) {
    choices = [];
  }

  const handleRadioChange = (selectedId) => {
    setMultipleChoices((prev) =>
      prev.map((option) => ({
        ...option,
        is_correct: option.id === selectedId, // Ensure only one is selected
      }))
    );
  };

  const handleInputChange = (id, newValue) => {
    setMultipleChoices(
      choices.map((option) => ({
        ...option,
        option: option.id === id ? newValue : option.option,
      }))
    );
  };

  switch (category) {
    case "Numeric":
      return <Input disabled={!isEditing} type="number" value={choices[0].option} onChange={(e) => handleInputChange(1, e.target.value)} />;
    case "Identification":
      return <Input disabled={!isEditing} type="text" value={choices[0].option} onChange={(e) => handleInputChange(1, e.target.value)} />;
    case "True/False":
      return (
        <RadioGroup
          value={choices.find((option) => option.is_correct)?.id || null}
          onChange={(val) => handleRadioChange(Number(val))}
        >
          <Stack spacing={4}>
            {choices.map((option, index) => (
              <Radio
                key={index}
                disabled={!isEditing}
                value={option.id} // controlled by RadioGroup
              >
                {option.option}
              </Radio>
            ))}
          </Stack>
        </RadioGroup>
      );
    case "Multiple":
      return (
        <RadioGroup>
          <Stack spacing={4}>
            {choices.map((option, index) => (
              <Flex
                key={index}
                direction="row"
                alignItems="center"
                gap={4}
              >
                <Checkbox
                  onChange={() =>
                    setMultipleChoices(
                      choices.map(o =>
                        o.id === option.id ? { ...o, is_correct: !o.is_correct } : o
                      )
                    )
                  }
                  size="lg"
                  disabled={!isEditing}
                  isChecked={option.is_correct}
                />
                <Input onChange={(e) => handleInputChange(option.id, e.target.value)} disabled={!isEditing} type="text" value={option.option} />
              </Flex>
            ))}
          </Stack>
        </RadioGroup>
      );
    default:
      return null;
  }
}