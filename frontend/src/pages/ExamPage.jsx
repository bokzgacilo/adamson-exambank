import {
  Button,
  Heading,
  Stack,
  Flex,
  useDisclosure,
  Card,
  CardHeader,
  CardBody,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  SimpleGrid,
  ModalFooter,
  Text,
  RadioGroup,
  Radio,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { BiPlus } from "react-icons/bi";
import CreateExamForm from "../components/CreateExamForm";
import ExamDataTable from "../components/ExamDataTable";
import useUserStore from "../helper/useUserStore";
import { TbArrowRight, TbCheck } from "react-icons/tb";

export default function ExamPage() {
  const {
    isOpen: IsOpenExamBuilder,
    onOpen: OnOpenExamBuilder,
    onClose: OnCloseExamBuilder,
  } = useDisclosure();
  const { user } = useUserStore();
  const [IsTOS, SetIsTOS] = useState("upload");
  const [Exams, SetExams] = useState([]);
  const [IsExamBuilderOpen, SetIsExamBuilderOpen] = useState(false)
  const [QuestionSet, SetQuestionSet] = useState([]);

  const [TOS, SetTOS] = useState({
    Knowledge : 10,
    Comprehension: 10,
    Application: 10,
    Analysis: 10,
    Synthesis: 10,
    Evaluation: 10
  })

  useEffect(() => {
    axios
      .get(
        `http://localhost/exam-bank/api/ExamRoute.php?action=viewAll&subject=${user.user_assigned_subject}`
      )
      .then((response) => {
        SetExams(response.data);
      });
  }, [IsTOS]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost/exam-bank/api/ServicesRoute.php?action=upload_tos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(response.data)
      SetTOS(response.data)
    } catch (error) {
      console.error("Error uploading file:", error);
    }

  }

  const DownloadFormat = () => {
    const link = document.createElement("a");
    link.href = "/TOS_FORMAT.xlsx";
    link.download = "TOS_FORMAT.xlsx";
    link.click();
  }

  const RenderTOS = (tos) => {
    switch(tos){
      case "upload":
        return (
          <>
            <Text fontWeight="semibold">UPLOAD TOS FILE</Text>
            <Flex direction="row" alignItems="center" gap={4}>
              <Input accept=".xlsx" onChange={handleFileChange} size="sm" type="file" />
              <Button onClick={DownloadFormat} size="sm">Template</Button>
            </Flex>
            <Text fontSize="12px">Accepted files (.CSV, .XLSX, .JPG)</Text>
            <Text fontSize="12px" fontWeight="semibold">Knowledge</Text>
            <NumberInput value={TOS.Knowledge} onChange={(value) => SetTOS({...TOS, Knowledge : value})} size="sm" min={5} max={25} allowMouseWheel>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Text fontSize="12px" fontWeight="semibold">Comprehension</Text>
            <NumberInput value={TOS.Comprehension} onChange={(value) => SetTOS({...TOS, Comprehension : value})} size="sm" min={5} max={25} allowMouseWheel>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Text fontSize="12px" fontWeight="semibold">Application</Text>
            <NumberInput value={TOS.Application} onChange={(value) => SetTOS({...TOS, Application : value})} size="sm" min={5} max={25} allowMouseWheel>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Text fontSize="12px" fontWeight="semibold">Analysis</Text>
            <NumberInput value={TOS.Analysis} onChange={(value) => SetTOS({...TOS, Analysis : value})} size="sm" min={5} max={25} allowMouseWheel>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Text fontSize="12px" fontWeight="semibold">Synthesis</Text>
            <NumberInput value={TOS.Synthesis} onChange={(value) => SetTOS({...TOS, Synthesis : value})} size="sm" min={5} max={25} allowMouseWheel>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Text fontSize="12px" fontWeight="semibold">Evaluation</Text>
            <NumberInput value={TOS.Evaluation} onChange={(value) => SetTOS({...TOS, Evaluation : value})} size="sm" min={5} max={25} allowMouseWheel>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </>
        )
      default:
        return (
          <>
            <Text fontWeight="semibold">SET CATEGORY ITEMS</Text>
            <Text fontSize="12px" fontWeight="semibold">Knowledge</Text>
            <NumberInput value={TOS.Knowledge} onChange={(value) => SetTOS({...TOS, Knowledge : value})} size="sm" min={5} max={25} allowMouseWheel>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Text fontSize="12px" fontWeight="semibold">Comprehension</Text>
            <NumberInput value={TOS.Comprehension} onChange={(value) => SetTOS({...TOS, Comprehension : value})} size="sm" min={5} max={25} allowMouseWheel>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Text fontSize="12px" fontWeight="semibold">Application</Text>
            <NumberInput value={TOS.Application} onChange={(value) => SetTOS({...TOS, Application : value})} size="sm" min={5} max={25} allowMouseWheel>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Text fontSize="12px" fontWeight="semibold">Analysis</Text>
            <NumberInput value={TOS.Analysis} onChange={(value) => SetTOS({...TOS, Analysis : value})} size="sm" min={5} max={25} allowMouseWheel>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Text fontSize="12px" fontWeight="semibold">Synthesis</Text>
            <NumberInput value={TOS.Synthesis} onChange={(value) => SetTOS({...TOS, Synthesis : value})} size="sm" min={5} max={25} allowMouseWheel>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Text fontSize="12px" fontWeight="semibold">Evaluation</Text>
            <NumberInput value={TOS.Evaluation} onChange={(value) => SetTOS({...TOS, Evaluation : value})} size="sm" min={5} max={25} allowMouseWheel>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </>
        )
    }
  }

  const TOSPickerHandler = (picked) => {
    SetIsTOS(picked)
  }

  const HandleProceedTOS = () => {
    SetIsExamBuilderOpen(true)
  }

  const HandleCloseExamBuilder =() => {
    SetIsTOS("upload")
    SetIsExamBuilderOpen(false)
    SetTOS({
      Knowledge : 10,
      Comprehension: 10,
      Application: 10,
      Analysis: 10,
      Synthesis: 10,
      Evaluation: 10
    })
    OnCloseExamBuilder()
  }

  const HandleCreateExam = () => {
    const totalSum = Object.values(TOS).map(Number).reduce((sum, value) => sum + value, 0);
    console.log(QuestionSet.length)
    console.log(totalSum)

    if(totalSum === QuestionSet.length){
      alert("COMPLETE")
    }else {
      alert("INCOMPLETE")
    }
  }

  return (
    <>
      <Modal size={!IsExamBuilderOpen ? "4xl" : "full" } isOpen={IsOpenExamBuilder} onClose={HandleCloseExamBuilder}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <ModalCloseButton />
            <Heading size="md">{!IsExamBuilderOpen ? "SELECT METHOD" : "EXAM BUILDER" }</Heading>
          </ModalHeader>
          <ModalBody>
            {IsExamBuilderOpen ? <CreateExamForm TOS={TOS}  QuestionSet={QuestionSet} SetQuestionSet={SetQuestionSet} /> : <>
              <SimpleGrid columns={2}>
                <RadioGroup onChange={(picked) => TOSPickerHandler(picked)} defaultValue="upload">
                  <Stack spacing={4}>
                    <Radio value="upload" size="lg">
                        <Heading size="sm">Upload TOS</Heading>
                    </Radio>
                    <Radio value="manual" size="lg">
                        <Heading size="sm">Manual TOS</Heading>
                    </Radio>
                  </Stack>
                </RadioGroup>
                  <Stack>
                    {RenderTOS(IsTOS)}
                  </Stack>
              </SimpleGrid>
            </>}
          
          </ModalBody>
          <ModalFooter>
            <Button colorScheme={!IsExamBuilderOpen ? "blue" : "green"} rightIcon={!IsExamBuilderOpen ? <TbArrowRight /> : <TbCheck />} onClick={!IsExamBuilderOpen ? HandleProceedTOS : HandleCreateExam}>
              {!IsExamBuilderOpen ? "Next" : "Create Exam"}
            </Button>
          </ModalFooter>
        </ModalContent>
        {}
      </Modal>
      <Stack p={4}>
        <Card>
          <CardHeader backgroundColor="#2b2b2b" color="#fff">
            <Flex
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Heading size="md">EXAM LIST</Heading>
              {user.usertype !== "Instructor" && (
                <Flex direction="row" gap={2}>
                  <Button
                    leftIcon={<BiPlus />}
                    colorScheme="green"
                    onClick={OnOpenExamBuilder}
                  >
                    Create Exam
                  </Button>
                </Flex>
              )}
            </Flex>
          </CardHeader>
          <Divider />
          <CardBody p={4}>
            <ExamDataTable data={Exams} />
          </CardBody>
        </Card>
      </Stack>
    </>
  );
}
