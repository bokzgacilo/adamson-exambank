import {
  Button,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import CreateExamForm from "./CreateExamForm";
import { TbArrowRight, TbCheck } from "react-icons/tb";
import { useEffect, useState } from "react";
import axios from "axios";
import RENDERTOS from "./RENDERTOS";
import PropTypes from "prop-types";
import useUserStore from "../helper/useUserStore";

const AccessCode = Math.floor(100000 + Math.random() * 900000);

ExamBuilder.propTypes = {
  refreshData: PropTypes.func.isRequired,
  isOpen: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default function ExamBuilder({ refreshData, isOpen, onClose }) {
  const toast = useToast();
  const user = useUserStore((state) => state.user);
  const [ExamName, SetExamName] = useState("");
  const [SelectedSubject, SetSelectedSubject] = useState("");
  const [QuestionSet, SetQuestionSet] = useState([]);
  const [Subjects, SetSubjects] = useState([]);
  const [mode, setMode] = useState("upload");
  const [TOS, SetTOS] = useState({
    Knowledge: 0,
    Comprehension: 0,
    Application: 0,
    Analysis: 0,
    Synthesis: 0,
    Evaluation: 0,
  });
  const [StepOne, SetStepOne] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subjectsResponse = await axios.get(
          `${import.meta.env.VITE_API_HOST}SubjectRoute.php?action=viewAll`
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

    SetStepOne(true);
  }, []);


  const HandleProceedTOS = () => {
    if (ExamName === "") {
      alert("Name expected");
      return;
    }

    setIsLoading(true)

    if (mode === "upload") {
      axios
        .post(`${import.meta.env.VITE_API_HOST}ExamRoute.php?action=GenerateTOSQuestion`, {
          subject: SelectedSubject,
          tos: TOS,
          mode: mode,
        })
        .then((response) => {
          SetQuestionSet(response.data.data);
          SetTOS(response.data.tos)
          SetStepOne(false);
          setIsLoading(false)
        });
    } else {
      SetQuestionSet([]);
      SetStepOne(false);
      setIsLoading(false)
    }
  };


  const HandleCreateExam = () => {
    if(QuestionSet.length === 0){
      alert("Please add question to the exam.")
      return;
    }

    const totalSum = Object.values(TOS)
      .map(Number)
      .reduce((sum, value) => sum + value, 0);

    const data = {
      access_code: AccessCode,
      questions: QuestionSet,
      subject: SelectedSubject,
      created_by: user.fullname,
      tos: TOS,
      exam_name: ExamName,
    };

    if (totalSum === QuestionSet.length) {
      axios
        .post(
          `${import.meta.env.VITE_API_HOST}ExamRoute.php?action=create`,
          data
        )
        .then((response) => {
          // FIREBASE CREATE EXAM
        })
        .catch((error) => {
          console.error("Error:", error);
        })
        .finally(() => {
          onClose();

          toast({
            title: "Exam Created",
            status: "success",
            duration: 3000,
            isClosable: true,
          });

          refreshData()
        });
    } else {
      alert("Incomplete");
    }
  };

  return (
    <Modal size={StepOne ? "3xl" : "full"} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <ModalCloseButton />
          <Heading size="lg">
            {StepOne ? "Select Mode" : "Exam Builder"}
          </Heading>
        </ModalHeader>
        <ModalBody flex="1">
          {!StepOne ? (
            <CreateExamForm
              AccessCode={AccessCode}
              TOS_TYPE={mode}
              SelectedSubject={SelectedSubject}
              TOS={TOS}
              QuestionSet={QuestionSet}
              SetQuestionSet={SetQuestionSet}
            />
          ) : (
            <>
              <Stack>
                <Text fontWeight="semibold">Mode</Text>
                <RadioGroup
                  onChange={(picked) => setMode(picked)}
                  defaultValue="upload"
                >
                  <Stack
                    spacing={4}
                    direction="row"
                    justifyContent="space-evenly"
                  >
                    <Radio size="lg" value="upload">
                      <Heading size="md">Exam Generator</Heading>
                    </Radio>
                    <Radio  size="lg" value="manual">
                      <Heading size="md">Manual TOS</Heading>
                    </Radio>
                  </Stack>
                </RadioGroup>
                <Text fontWeight="semibold" mt={2}>
                  Name
                </Text>
                <Input
                  placeholder="Enter exam name"
                  type="text"
                  value={ExamName}
                  onChange={(e) => SetExamName(e.currentTarget.value)}
                />
                <Text fontWeight="semibold" mt={2}>
                  Subject
                </Text>
                <Select
                  onChange={(e) => SetSelectedSubject(e.target.value)}
                  mb={2}
                >
                  {Subjects.map((subject, index) => (
                    <option key={index} value={subject.name}>
                      {subject.name}
                    </option>
                  ))}
                </Select>
                <Stack>
                  <RENDERTOS SetTOS={SetTOS} mode={mode} TOS={TOS} />
                </Stack>
              </Stack>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            mr={4}
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            colorScheme={StepOne ? "blue" : "green"}
            rightIcon={StepOne ? <TbArrowRight /> : <TbCheck />}
            onClick={StepOne ? HandleProceedTOS : HandleCreateExam}
            isLoading={isLoading}
          >
            {StepOne ? "Next" : "Create Exam"}
          </Button>
        </ModalFooter>
      </ModalContent>
      { }
    </Modal>
  );
}
