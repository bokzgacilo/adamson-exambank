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
  Select,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { BiPlus } from "react-icons/bi";
import CreateExamForm from "../components/CreateExamForm";
import ExamDataTable from "../components/ExamDataTable";
import useUserStore from "../helper/useUserStore";
import { TbArrowRight, TbCheck } from "react-icons/tb";
import LoadingSpinner from "../components/LoadingSpinner";
const AccessCode = Math.floor(100000 + Math.random() * 900000);

export default function ExamPage() {
  const {
    isOpen: IsOpenExamBuilder,
    onOpen: OnOpenExamBuilder,
    onClose: OnCloseExamBuilder,
  } = useDisclosure();
  const { user } = useUserStore();
  const [IsTOS, SetIsTOS] = useState("upload");
  const [Exams, SetExams] = useState([]);
  const [ExamName, SetExamName] = useState("");
  const [IsExamBuilderOpen, SetIsExamBuilderOpen] = useState(false)
  const [QuestionSet, SetQuestionSet] = useState([]);
  const [Subjects, SetSubjects] = useState([])
  const [SelectedSubject, SetSelectedSubject] = useState("")
  const [ShowSpinner, SetShowSpinner] = useState(false)
  const toast = useToast();

  const [TOS, SetTOS] = useState({
    Knowledge : 1,
    Comprehension: 1,
    Application: 1,
    Analysis: 1,
    Synthesis: 1,
    Evaluation: 1
  })

  const minVal = 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const examsResponse = await axios.get(
          `http://localhost/exam-bank/api/ExamRoute.php?action=viewAll&subject=${user.user_assigned_subject}`
        );
        SetExams(examsResponse.data);

        const subjectsResponse = await axios.get(
          "http://localhost/exam-bank/api/SubjectRoute.php?action=viewAll"
        );
        SetSubjects(subjectsResponse.data);
        if (subjectsResponse.data.length > 0) {
          SetSelectedSubject(subjectsResponse.data[0].name);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost/exam-bank/api/ServicesRoute.php?action=upload_tos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

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
            <Text fontSize="12px" fontWeight="semibold" mt={4}>Knowledge</Text>
            <NumberInput value={TOS.Knowledge} onChange={(value) => SetTOS({...TOS, Knowledge : value})} size="sm" min={minVal} max={25} allowMouseWheel>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Text fontSize="12px" fontWeight="semibold">Comprehension</Text>
            <NumberInput value={TOS.Comprehension} onChange={(value) => SetTOS({...TOS, Comprehension : value})} size="sm" min={minVal} max={25} allowMouseWheel>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Text fontSize="12px" fontWeight="semibold">Application</Text>
            <NumberInput value={TOS.Application} onChange={(value) => SetTOS({...TOS, Application : value})} size="sm" min={minVal} max={25} allowMouseWheel>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Text fontSize="12px" fontWeight="semibold">Analysis</Text>
            <NumberInput value={TOS.Analysis} onChange={(value) => SetTOS({...TOS, Analysis : value})} size="sm" min={minVal} max={25} allowMouseWheel>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Text fontSize="12px" fontWeight="semibold">Synthesis</Text>
            <NumberInput value={TOS.Synthesis} onChange={(value) => SetTOS({...TOS, Synthesis : value})} size="sm" min={minVal} max={25} allowMouseWheel>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Text fontSize="12px" fontWeight="semibold">Evaluation</Text>
            <NumberInput value={TOS.Evaluation} onChange={(value) => SetTOS({...TOS, Evaluation : value})} size="sm" min={minVal} max={25} allowMouseWheel>
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
            <Text fontSize="12px" fontWeight="semibold" mt={4}>Knowledge</Text>
            <NumberInput value={TOS.Knowledge} onChange={(value) => SetTOS({...TOS, Knowledge : value})} size="sm" min={minVal} max={25} allowMouseWheel>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Text fontSize="12px" fontWeight="semibold">Comprehension</Text>
            <NumberInput value={TOS.Comprehension} onChange={(value) => SetTOS({...TOS, Comprehension : value})} size="sm" min={minVal} max={25} allowMouseWheel>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Text fontSize="12px" fontWeight="semibold">Application</Text>
            <NumberInput value={TOS.Application} onChange={(value) => SetTOS({...TOS, Application : value})} size="sm" min={minVal} max={25} allowMouseWheel>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Text fontSize="12px" fontWeight="semibold">Analysis</Text>
            <NumberInput value={TOS.Analysis} onChange={(value) => SetTOS({...TOS, Analysis : value})} size="sm" min={minVal} max={25} allowMouseWheel>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Text fontSize="12px" fontWeight="semibold">Synthesis</Text>
            <NumberInput value={TOS.Synthesis} onChange={(value) => SetTOS({...TOS, Synthesis : value})} size="sm" min={minVal} max={25} allowMouseWheel>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Text fontSize="12px" fontWeight="semibold">Evaluation</Text>
            <NumberInput value={TOS.Evaluation} onChange={(value) => SetTOS({...TOS, Evaluation : value})} size="sm" min={minVal} max={25} allowMouseWheel>
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
    if(ExamName === ""){
      alert("Name expected")
      return
    }

    if(IsTOS === "upload"){
      axios
      .get(
        `http://localhost/exam-bank/api/ExamRoute.php?action=GenerateTOSQuestion&Subject=${SelectedSubject}&TOS=${JSON.stringify(TOS)}`
      )
      .then((response) => {
        SetQuestionSet(response.data.data)
        SetIsExamBuilderOpen(true)
      });
    }else {
      SetQuestionSet([])
      SetIsExamBuilderOpen(true)
    }
  }

  const HandleCloseExamBuilder =() => {
    SetIsTOS("upload")
    SetIsExamBuilderOpen(false)
    SetQuestionSet([])
    SetTOS({
      Knowledge : 5,
      Comprehension: 5,
      Application: 5,
      Analysis: 5,
      Synthesis: 5,
      Evaluation: 5
    })
    OnCloseExamBuilder()
  }

  const HandleCreateExam = () => {
    const totalSum = Object.values(TOS).map(Number).reduce((sum, value) => sum + value, 0);
    const data = {
      access_code : AccessCode,
      questions: QuestionSet,
      subject: SelectedSubject,
      created_by: user.fullname,
      exam_name: ExamName
    }

    if(totalSum === QuestionSet.length){
      SetShowSpinner(true);

      axios.post("http://localhost/exam-bank/api/ExamRoute.php?action=create", data)
        .then(() => {
          // FIREBASE CREATE EXAM
        })
        .catch((error) => {
          console.error("Error:", error);
        })
        .finally(() => {
          SetShowSpinner(false);
          HandleCloseExamBuilder()

          toast({
            title: 'Exam Created',
            status: 'success',
            duration: 3000,
            isClosable: true,
          })
        });

    }else {
      alert("INCOMPLETE")
    }
  }

  return (
    <>
      {ShowSpinner && <LoadingSpinner />}
      <Modal size={!IsExamBuilderOpen ? "md" : "full" } isOpen={IsOpenExamBuilder} onClose={HandleCloseExamBuilder}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <ModalCloseButton />
            <Heading size="md">{!IsExamBuilderOpen ? "CREATE EXAM" : "EXAM BUILDER" }</Heading>
          </ModalHeader>
          <ModalBody flex="1">
            {IsExamBuilderOpen ? <CreateExamForm AccessCode={AccessCode} TOS_TYPE={IsTOS} SelectedSubject={SelectedSubject} TOS={TOS} QuestionSet={QuestionSet} SetQuestionSet={SetQuestionSet} /> : <>
              <Stack>
                <Text fontWeight="semibold">MODE</Text>
                <RadioGroup onChange={(picked) => TOSPickerHandler(picked)} defaultValue="upload">
                  <Stack spacing={4} direction='row' justifyContent="space-evenly">
                    <Radio value="upload">
                        <Heading size="sm">Upload TOS</Heading>
                    </Radio>
                    <Radio value="manual">
                        <Heading size="sm">Manual TOS</Heading>
                    </Radio>
                  </Stack>
                </RadioGroup>
                <Text fontWeight="semibold" mt={2}>NAME</Text>
                <Input
                  placeholder="Enter exam name"
                  size="sm"
                  type="text"
                  value={ExamName}
                  onChange={(e) => SetExamName(e.currentTarget.value)}
                />
                <Text fontWeight="semibold" mt={2}>SUBJECT</Text>
                 <Select size="sm"  onChange={(e) => SetSelectedSubject(e.target.value)} mb={2}>
                  {Subjects.map((subject) => (
                    <option key={subject.id} value={subject.name}>
                      {subject.name}
                    </option>
                  ))}
                </Select>
                <Stack>
                  {RenderTOS(IsTOS)}
                </Stack>
              </Stack>
            </>}
          
          </ModalBody>
          <ModalFooter>
            <Button size="sm" colorScheme={!IsExamBuilderOpen ? "blue" : "green"} rightIcon={!IsExamBuilderOpen ? <TbArrowRight /> : <TbCheck />} onClick={!IsExamBuilderOpen ? HandleProceedTOS : HandleCreateExam}>
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
                    size="sm"
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
