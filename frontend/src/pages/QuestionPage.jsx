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
import CreateQuestionForm from "../components/CreateQuestionForm";
import QuestionDataTable from "../components/QuestionDataTable";
import { TbFileExcel, TbPlus } from "react-icons/tb";
import CreateBatchQuestion from "../components/CreateBatchQuestion";
import { useEffect, useState } from "react";
import axios from "axios";
import useUserStore from "../helper/useUserStore";
import LoadingSpinner from "../components/LoadingSpinner";
import { onChildAdded, ref } from "firebase/database";
import { database } from "../helper/Firebase";

export default function QuestionPage() {
  const { user } = useUserStore();
  const [ShowSpinner, SetShowSpinner] = useState(false)

  const {
    isOpen: SingleIsOpen,
    onOpen: SingleOnOpen,
    onClose: SingleOnClose,
  } = useDisclosure();

  const {
    isOpen: BatchIsOpen,
    onOpen: BatchOnOpen,
    onClose: BatchOnClose,
  } = useDisclosure();
  const [Questions, SetQuestions] = useState([]);

  useEffect(() => {

    const FetchAllQuestions = async () => {
      await axios
        .post(
          `http://localhost/exam-bank/api/QuestionRoute.php?action=viewAll`,
          {
            subject: user.user_assigned_subject,
            type: user.usertype,
          }
        )
        .then((response) => {
          SetQuestions(response.data);
        });
    };

    FetchAllQuestions();

    const logRef = ref(database, "/logs");

    const unsubscribe = onChildAdded(logRef, () => {
      FetchAllQuestions()
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  return (
    <Stack>
      {ShowSpinner && <LoadingSpinner />}
      
      <CreateQuestionForm
        onClose={SingleOnClose}
        isOpen={SingleIsOpen}
        onOpen={SingleOnOpen}
        spinner={SetShowSpinner}
      />
      <CreateBatchQuestion
        onClose={BatchOnClose}
        isOpen={BatchIsOpen}
        onOpen={BatchOnOpen}
        spinner={SetShowSpinner}
      />
      <Stack p={4}>
        <Card>
          <CardHeader backgroundColor="#2b2b2b" color="#fff">
            <Flex
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Heading size="md">QUESTION LIST</Heading>
              <Flex direction="row" gap={2}>
                <Button
                  size="sm"
                  leftIcon={<TbPlus />}
                  colorScheme="green"
                  onClick={SingleOnOpen}
                >
                  Single
                </Button>
                <Button
                  size="sm"
                  leftIcon={<TbFileExcel />}
                  colorScheme="green"
                  onClick={BatchOnOpen}
                >
                  Batch
                </Button>
              </Flex>
            </Flex>
          </CardHeader>
          <Divider />
          <CardBody p={4}>
            <QuestionDataTable data={Questions} />
          </CardBody>
        </Card>
      </Stack>
    </Stack>
  );
}
