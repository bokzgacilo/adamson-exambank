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
    Identification : 10,
    Multiple: 10,
    Enumeration: 10,
    "True/False" : 10
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

  const RenderTOS = (tos) => {
    switch(tos){
      case "upload":
        return (
          <>
            <Text fontWeight="semibold">UPLOAD TOS FILE</Text>
            <Input size="sm" type="file" />
            <Text fontSize="12px">Accepted files (.CSV, .XLSX, .JPG)</Text>
          </>
        )
      default:
        return (
          <>
            <Text fontWeight="semibold">SET CATEGORY ITEMS</Text>
            <Text fontSize="12px" fontWeight="semibold">Identification</Text>
            <NumberInput value={TOS.Identification} onChange={(value) => SetTOS({...TOS, Identification : value})} size="sm" min={5} max={25} allowMouseWheel>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Text fontSize="12px" fontWeight="semibold">Multiple Choice</Text>
            <NumberInput value={TOS.Multiple} onChange={(value) => SetTOS({...TOS, Multiple : value})} size="sm" min={5} max={25} allowMouseWheel>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Text fontSize="12px" fontWeight="semibold">Enumeration</Text>
            <NumberInput value={TOS.Enumeration} onChange={(value) => SetTOS({...TOS, Enumeration : value})} size="sm" min={5} max={25} allowMouseWheel>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Text fontSize="12px" fontWeight="semibold">True/False</Text>
            <NumberInput value={TOS["True/False"]} onChange={(value) => SetTOS({...TOS, "True/False" : value})} size="sm" min={5} max={25} allowMouseWheel>
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
      identification : 10,
      multiple: 10,
      enumeration: 10,
      true_false : 10
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
      <Modal size="4xl" isOpen={IsOpenExamBuilder} onClose={HandleCloseExamBuilder}>
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
