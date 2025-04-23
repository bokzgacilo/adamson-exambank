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

export default function ExamBuilder({refreshData, isOpen, onClose }) {
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

  useEffect(() => {
    const fetchData = async () => {
      try {
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

    SetStepOne(true);
  }, []);


  const HandleProceedTOS = () => {
    if (ExamName === "") {
      alert("Name expected");
      return;
    }

    if (mode === "upload") {
      axios
        .get(
          `http://localhost/exam-bank/api/ExamRoute.php?action=GenerateTOSQuestion&Subject=${SelectedSubject}&TOS=${JSON.stringify(
            TOS
          )}`
        )
        .then((response) => {
          SetQuestionSet(response.data.data);
          SetStepOne(false);
        });
    } else {
      SetQuestionSet([]);
      SetStepOne(false);
    }
  };

 
  const HandleCreateExam = () => {
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
          "http://localhost/exam-bank/api/ExamRoute.php?action=create",
          data
        )
        .then((response) => {
          console.log(response.data);
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
      alert("INCOMPLETE");
    }
  };

  return (
    <Modal size={StepOne ? "md" : "full"} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <ModalCloseButton />
          <Heading size="md">
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
                <Text fontWeight="semibold">MODE</Text>
                <RadioGroup
                  onChange={(picked) => setMode(picked)}
                  defaultValue="upload"
                >
                  <Stack
                    spacing={4}
                    direction="row"
                    justifyContent="space-evenly"
                  >
                    <Radio value="upload">
                      <Heading size="sm">Upload TOS</Heading>
                    </Radio>
                    <Radio value="manual">
                      <Heading size="sm">Manual TOS</Heading>
                    </Radio>
                  </Stack>
                </RadioGroup>
                <Text fontWeight="semibold" mt={2}>
                  NAME
                </Text>
                <Input
                  placeholder="Enter exam name"
                  size="sm"
                  type="text"
                  value={ExamName}
                  onChange={(e) => SetExamName(e.currentTarget.value)}
                />
                <Text fontWeight="semibold" mt={2}>
                  SUBJECT
                </Text>
                <Select
                  size="sm"
                  onChange={(e) => SetSelectedSubject(e.target.value)}
                  mb={2}
                >
                  {Subjects.map((subject) => (
                    <option key={subject.id} value={subject.name}>
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
            size="sm"
            colorScheme={StepOne ? "blue" : "green"}
            rightIcon={StepOne ? <TbArrowRight /> : <TbCheck />}
            onClick={StepOne ? HandleProceedTOS : HandleCreateExam}
          >
            {StepOne ? "Next" : "Create Exam"}
          </Button>
        </ModalFooter>
      </ModalContent>
      {}
    </Modal>
  );
}
