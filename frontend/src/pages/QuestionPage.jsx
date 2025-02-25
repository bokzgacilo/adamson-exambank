import { Button, Heading, Stack, Flex, useDisclosure, Card, CardHeader, CardBody, Divider } from "@chakra-ui/react";
import CreateQuestionForm from "../components/CreateQuestionForm";
import QuestionDataTable from "../components/QuestionDataTable";
import { TbFileExcel, TbPlus } from "react-icons/tb";
import CreateBatchQuestion from "../components/CreateBatchQuestion";
import { useEffect, useState } from "react";
import axios from "axios";
import useUserStore from "../helper/useUserStore";
import { getDatabase, ref } from "firebase/database";
import app from "../helper/Firebase";

export default function QuestionPage() {
  const {user} = useUserStore()
  const { isOpen: SingleIsOpen, onOpen : SingleOnOpen, onClose : SingleOnClose } = useDisclosure();
  const { isOpen: BatchIsOpen, onOpen : BatchOnOpen, onClose : BatchOnClose } = useDisclosure();
   const [Questions, SetQuestions] = useState([])

  useEffect(() => {

      axios.post(`http://localhost/exam-bank/api/QuestionRoute.php?action=viewAll`, {
        subject: user.user_assigned_subject,
        type: user.usertype
      })
      .then(response => {
        SetQuestions(response.data);
      });
  }, []);

  return (
    <Stack>
      <CreateQuestionForm onClose={SingleOnClose} isOpen={SingleIsOpen} onOpen={SingleOnOpen}  />
      <CreateBatchQuestion onClose={BatchOnClose} isOpen={BatchIsOpen} onOpen={BatchOnOpen} />
      <Stack p={4}>
        <Card>
          <CardHeader backgroundColor="#2b2b2b" color="#fff">
            <Flex direction="row" alignItems="center" justifyContent="space-between">
              <Heading size="md">QUESTION LIST</Heading>
              <Flex direction="row" gap={2}>
                <Button leftIcon={<TbPlus />} colorScheme="green" onClick={SingleOnOpen}>Single</Button>
                <Button leftIcon={<TbFileExcel />} colorScheme="green" onClick={BatchOnOpen}>Batch</Button>
              </Flex>
            </Flex>
          </CardHeader>
          <Divider />
          <CardBody p={4}>
            <QuestionDataTable data={Questions}/>
          </CardBody>
        </Card>
      </Stack>
    </Stack>
  );
}
