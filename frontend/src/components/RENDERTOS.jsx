import { Button, Flex, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Text } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

const minVal = 1;

export default function RENDERTOS ({mode, TOS, SetTOS}) {
  
  const DownloadFormat = () => {
    const link = document.createElement("a");
    link.href = "http://localhost/exam-bank/TOS_FORMAT.xlsx";
    link.download = "http://localhost/exam-bank/TOS_FORMAT.xlsx";
    link.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost/exam-bank/api/ServicesRoute.php?action=upload_tos",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      SetTOS(response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  switch(mode) {
    case "upload":
      return (
        <>
          <Text fontWeight="semibold">UPLOAD TOS FILE</Text>
          <Flex direction="row" alignItems="center" gap={4}>
            <Input
              accept=".xlsx"
              onChange={handleFileChange}
              size="sm"
              type="file"
            />
            <Button onClick={DownloadFormat} size="sm">
              Template
            </Button>
          </Flex>
          <Text fontSize="12px">Accepted files (.CSV, .XLSX, .JPG)</Text>
        </>
      );
    default:
      return (
        <>
          <Text fontWeight="semibold">SET CATEGORY ITEMS</Text>
          <Text fontSize="12px" fontWeight="semibold" mt={4}>
            Knowledge
          </Text>
          <NumberInput
            value={TOS.Knowledge}
            onChange={(value) => SetTOS({ ...TOS, Knowledge: value })}
            size="sm"
            min={minVal}
            max={25}
            allowMouseWheel
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Text fontSize="12px" fontWeight="semibold">
            Comprehension
          </Text>
          <NumberInput
            value={TOS.Comprehension}
            onChange={(value) => SetTOS({ ...TOS, Comprehension: value })}
            size="sm"
            min={minVal}
            max={25}
            allowMouseWheel
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Text fontSize="12px" fontWeight="semibold">
            Application
          </Text>
          <NumberInput
            value={TOS.Application}
            onChange={(value) => SetTOS({ ...TOS, Application: value })}
            size="sm"
            min={minVal}
            max={25}
            allowMouseWheel
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Text fontSize="12px" fontWeight="semibold">
            Analysis
          </Text>
          <NumberInput
            value={TOS.Analysis}
            onChange={(value) => SetTOS({ ...TOS, Analysis: value })}
            size="sm"
            min={minVal}
            max={25}
            allowMouseWheel
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Text fontSize="12px" fontWeight="semibold">
            Synthesis
          </Text>
          <NumberInput
            value={TOS.Synthesis}
            onChange={(value) => SetTOS({ ...TOS, Synthesis: value })}
            size="sm"
            min={minVal}
            max={25}
            allowMouseWheel
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Text fontSize="12px" fontWeight="semibold">
            Evaluation
          </Text>
          <NumberInput
            value={TOS.Evaluation}
            onChange={(value) => SetTOS({ ...TOS, Evaluation: value })}
            size="sm"
            min={minVal}
            max={25}
            allowMouseWheel
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </>
      );
  }
};
