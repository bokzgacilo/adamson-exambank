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
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { BiPlus } from "react-icons/bi";
import ExamDataTable from "../components/ExamDataTable";
import useUserStore from "../helper/useUserStore";
import ExamDetail from "../components/ExamDetail";
import ExamBuilder from "../components/ExamBuilder";
import EditExamForm from "../components/EditExamForm";

export default function ExamPage() {
  const { user } = useUserStore();
  const [Exams, SetExams] = useState([]);
  const [selectedExam, SetSelectedExam] = useState({});
  const {isOpen: editExamOpen, onOpen: editExamOnOpen, onClose: editExamOnClose} = useDisclosure()
  const {isOpen: examBuilderOpen, onOpen: examBuilderOnOpen, onClose: examBuilderOnClose} = useDisclosure()
  const {isOpen: detailOpen, onOpen: detailOnOpen, onClose: detailOnClose} = useDisclosure()

  const getAllExams = async () => {
    const examsResponse = await axios.get(
      "http://localhost/exam-bank/api/ExamRoute.php?action=viewAll",
      {
        params: {
          subjects: JSON.stringify(user.user_assigned_subject),
          type: user.usertype
        },
      }
    );
    SetExams(examsResponse.data);
  }

  useEffect(() => {
    getAllExams();
  }, []);

  const EditExam = () => {
    detailOnClose()

    editExamOnOpen()
  }

  return (
    <>
      {editExamOpen && <EditExamForm refreshData={getAllExams} data={selectedExam} onClose={editExamOnClose} isOpen={editExamOnOpen} />}
      {detailOpen && <ExamDetail editExam={EditExam} refreshData={getAllExams} selectedExam={selectedExam} onClose={detailOnClose} isOpen={detailOpen} />}
      {examBuilderOpen && <ExamBuilder refreshData={getAllExams} selectedExam={selectedExam} onClose={examBuilderOnClose} isOpen={examBuilderOpen} />}
      
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
                    onClick={examBuilderOnOpen}
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
            <ExamDataTable onOpen={detailOnOpen} SetSelectedExam={SetSelectedExam} data={Exams} />
          </CardBody>
        </Card>
      </Stack>
    </>
  );
}