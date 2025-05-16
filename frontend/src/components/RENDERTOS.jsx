import { Button, Flex, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Text } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { TbDownload } from "react-icons/tb";

const minVal = 0;
const maxVal = 100;

export default function RENDERTOS ({mode, TOS, SetTOS}) {
  const DownloadFormat = () => {
    const link = document.createElement("a");
    link.href = `${import.meta.env.VITE_HOST}TOS_FORMAT.xlsx`;
    link.download = "TOS_FORMAT.xlsx";
    link.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_HOST}ServicesRoute.php?action=upload_tos`,
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
          <Text fontWeight="semibold">Upload TOS File</Text>
          <Flex direction="row" alignItems="center" gap={4}>
            <Input
              accept=".xlsx"
              onChange={handleFileChange}
              type="file"
            />
            <Button leftIcon={<TbDownload />} onClick={DownloadFormat}>
              Template
            </Button>
          </Flex>
          <Text fontSize="12px">Accepted files (.CSV, .XLSX, .JPG)</Text>
        </>
      );
    default:
      return (
        <>
          <Text fontWeight="semibold">Category Items</Text>
          <Text fontWeight="semibold">
            Knowledge
          </Text>
          <NumberInput
            value={TOS.Knowledge}
            onChange={(value) => SetTOS({ ...TOS, Knowledge: value })}
            min={minVal}
            max={maxVal}
            allowMouseWheel
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Text fontWeight="semibold">
            Comprehension
          </Text>
          <NumberInput
            value={TOS.Comprehension}
            onChange={(value) => SetTOS({ ...TOS, Comprehension: value })}
            min={minVal}
            max={maxVal}
            allowMouseWheel
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Text fontWeight="semibold">
            Application
          </Text>
          <NumberInput
            value={TOS.Application}
            onChange={(value) => SetTOS({ ...TOS, Application: value })}
            min={minVal}
            max={maxVal}
            allowMouseWheel
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Text fontWeight="semibold">
            Analysis
          </Text>
          <NumberInput
            value={TOS.Analysis}
            onChange={(value) => SetTOS({ ...TOS, Analysis: value })}
            min={minVal}
            max={maxVal}
            allowMouseWheel
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Text fontWeight="semibold">
            Synthesis
          </Text>
          <NumberInput
            value={TOS.Synthesis}
            onChange={(value) => SetTOS({ ...TOS, Synthesis: value })}
            min={minVal}
            max={maxVal}
            allowMouseWheel
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Text fontWeight="semibold">
            Evaluation
          </Text>
          <NumberInput
            value={TOS.Evaluation}
            onChange={(value) => SetTOS({ ...TOS, Evaluation: value })}
            min={minVal}
            max={maxVal}
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
