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

import QuestionDataTable from "../components/question/QuestionDataTable";
import { TbFileExcel, TbPlus } from "react-icons/tb";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import useUserStore from "../helper/useUserStore";
import { onChildAdded, ref } from "firebase/database";
import { database } from "../helper/Firebase";
import CreateQuestionModal from "../components/question/CreateQuestionModal";
import BatchQuestionModal from "../components/question/BatchQuestionModal";

export default function QuestionPage() {
  const { user } = useUserStore();
  const [questions, setQuestions] = useState([]);
  const didFetch = useRef(false);

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

  const fetchAllQuestions = async () => {
    await axios
      .post(`${import.meta.env.VITE_API_HOST}QuestionRoute.php?action=viewAll`, {
        subject: user.user_assigned_subject,
        type: user.usertype,
      }).then((response) => {
        setQuestions(response.data);
      });
  };

  // listen to firebase realtime updates
  useEffect(() => {
    fetchAllQuestions()
  }, []);

  return (
    <Stack>
      {SingleIsOpen && (
        <CreateQuestionModal
          isOpen={SingleIsOpen}
          onClose={SingleOnClose}
          onOpen={SingleOnOpen}
          refreshTable={fetchAllQuestions}
        />
      )}

      {BatchIsOpen && (
        <BatchQuestionModal
          isOpen={BatchIsOpen}
          onClose={BatchOnClose}
          onOpen={BatchOnOpen}
          refreshTable={fetchAllQuestions}
        />
      )}
      
      <Stack>
        <Card height="100dvh">
          <CardHeader backgroundColor="#141414" color="#fff">
            <Flex
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Heading>Question Bank</Heading>
              <Flex direction="row" gap={4}>
                <Button
                  leftIcon={<TbPlus />}
                  colorScheme="green"
                  onClick={SingleOnOpen}
                >
                  Single
                </Button>
                <Button
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
          <CardBody p={0}>
            <QuestionDataTable data={questions} refreshTable={fetchAllQuestions} />
          </CardBody>
        </Card>
      </Stack>
    </Stack>
  );
}
