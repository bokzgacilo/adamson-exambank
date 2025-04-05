import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import axios from "axios";
import { useState } from "react";
import { PrimeReactProvider } from "primereact/api";
import {
  Divider,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useToast,
  Tag,
  Text,
} from "@chakra-ui/react";
import { Button, useDisclosure } from "@chakra-ui/react";
import PropTypes from "prop-types";
import QuestionDetail from "./QuestionDetail";
import { TbCheck, TbPencil, TbTrash, TbX } from "react-icons/tb";
import EditQuestionForm from "./EditQuestionForm";
import useUserStore from "../helper/useUserStore";
import { ref, set } from "firebase/database";
import { database } from "../helper/Firebase";

QuestionDataTable.propTypes = {
  data: PropTypes.any.isRequired,
};

export default function QuestionDataTable({ data }) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [IsEditing, SetIsEditing] = useState(false);
  const [UpdatedQuestionData, SetUpdatedQuestionData] = useState([]);
  const toast = useToast();
  const { user } = useUserStore();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const HandleToggleEdit = () => {
    SetIsEditing(true);
  };

  const QuestionTemplate = (rowData) => (
    <Text fontWeight="semibold" cursor="pointer" onClick={() => OpenQuestion(rowData)}>
      {rowData.question}
    </Text>
  );

  const StatusTemplate = (rowData) => (
    <Tag size="sm" colorScheme={rowData.status == 1 ? "green" : "red"}>
      {rowData.status == 1 ? "Active" : "Inactive"}
    </Tag>
  );

  const OpenQuestion = (rowData) => {
    setSelectedQuestion(rowData);
    onOpen();
  };

  const CloseQuestion = () => {
    setSelectedQuestion([]);
    SetIsEditing(false);
    onClose();
  };

  const HandleSaveEdit = () => {
    axios
      .post(
        "http://localhost/exam-bank/api/QuestionRoute.php?action=update",
        UpdatedQuestionData
      )
      .then((response) => {
        toast({
          title: "Question Updated!",
          description: `Question ${UpdatedQuestionData.id} updated`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        // FIREBASE UPDATE QUESTION
        set(ref(database, `logs/${Date.now()}`), { action: "Question Updated", timestamp: Date.now(), target: selectedQuestion.question, actor: user.fullname });
        onClose();
      });
  };

  const HandleEnable = () => {
    axios
      .post("http://localhost/exam-bank/api/QuestionRoute.php?action=enable", {
        id: selectedQuestion.id,
      })
      .then((response) => {
        if (response.data) {
          toast({
            title: "Question Enabled!",
            description: `Question ${selectedQuestion.id} enabled`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          // FIREBASE ENABLE QUESTION
          onClose();
        }
      });
  };

  const HandleDisable = () => {
    axios
      .post("http://localhost/exam-bank/api/QuestionRoute.php?action=disable", {
        id: selectedQuestion.id,
      })
      .then((response) => {
        if (response.data) {
          toast({
            title: "Question Disabled!",
            description: `Question ${selectedQuestion.id} disabled`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          // FIREBASE DISABLE QUESTION
          onClose();
        }
      });
  };

  const HandleDelete = () => {
    axios
    .post("http://localhost/exam-bank/api/QuestionRoute.php?action=delete", {
      id: selectedQuestion.id,
    })
    .then((response) => {
      if (response.data) {
        toast({
          title: "Question Deleted!",
          description: `Question ${selectedQuestion.id} deleted`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        set(ref(database, `logs/${Date.now()}`), { action: "Question Deleted", timestamp: Date.now(), target: selectedQuestion.question, actor: user.fullname });
        onClose();
      }
    });
  }

  return (
    <PrimeReactProvider>

      <Modal isOpen={isOpen} onClose={CloseQuestion}>
        <ModalOverlay />
        <ModalCloseButton />

        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>
            <Heading size="md">
              {!IsEditing ? "QUESTION" : "EDIT QUESTION"}
            </Heading>
          </ModalHeader>
          <ModalBody>
            {!IsEditing ? (
              <QuestionDetail QuestionData={selectedQuestion} />
            ) : (
              <EditQuestionForm
                SetUpdatedQuestionData={SetUpdatedQuestionData}
                QuestionData={selectedQuestion}
              />
            )}
          </ModalBody>
          <ModalFooter>
            {(user.fullname === selectedQuestion?.created_by ||
              user.usertype === "Coordinator" || user.usertype === "Admin") && (
              <Button
                leftIcon={!IsEditing ? <TbPencil /> : <TbCheck />}
                colorScheme={!IsEditing ? "blue" : "green"}
                onClick={!IsEditing ? HandleToggleEdit : HandleSaveEdit}
                size="sm"
                mr={2}
              >
                {!IsEditing ? "Edit" : "Save"}
              </Button>
            )}

            {!IsEditing && (user.fullname === selectedQuestion?.created_by ||
              user.usertype === "Coordinator" || user.usertype === "Admin") && (
              <>
                {selectedQuestion?.status == null ? (
                  ""
                ) : selectedQuestion.status !== "1" && !IsEditing ? (
                  <Button
                    leftIcon={<TbCheck />}
                    colorScheme="green"
                    size="sm"
                    onClick={HandleEnable}
                  >
                    Activate
                  </Button>
                ) : (
                  <Button
                    leftIcon={<TbX />}
                    size="sm"
                    onClick={HandleDisable}
                  >
                    Deactivate
                  </Button>
                )}

                <Button onClick={HandleDelete} ml={2} size="sm" colorScheme="red" leftIcon={<TbTrash />}>Delete</Button>
              </>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Stack>
        <Heading size="md">SEARCH</Heading>
        <Input
          type="text"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
          mb={4}
        />
      </Stack>
      <Divider mb={4} />
      <DataTable
        value={data}
        paginator
        rows={10}
        rowsPerPageOptions={[10, 15, 30]}
        showGridlines
        size="small"
        globalFilter={globalFilter} // 🔍 Enable global search
      >
        <Column field="id" header="ID" sortable></Column>
        <Column
          field="question"
          header="Question"
          filter
          body={QuestionTemplate}
          sortable
        ></Column>
        <Column field="category" header="Type" filter sortable></Column>
        <Column
          showFilterMenu={true}
          field="subject"
          filter
          header="Subject"
          sortable
        ></Column>
        <Column
          field="classification"
          header="Classification"
          sortable
        ></Column>
        <Column
          field="status"
          header="Status"
          body={StatusTemplate}
          filter
        ></Column>
      </DataTable>
    </PrimeReactProvider>
  );
}
