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
import { TbCheck, TbPencil, TbX } from "react-icons/tb";
import EditQuestionForm from "./EditQuestionForm";
import useUserStore from "../helper/useUserStore";
import LoadingSpinner from "./LoadingSpinner";

QuestionDataTable.propTypes = {
  data: PropTypes.any.isRequired,
};

export default function QuestionDataTable({ data }) {
  const [ShowSpinner, SetShowSpinner] = useState(false)

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
        if (response.data) {
          console.log(response.data);

          toast({
            title: "Question Updated!",
            description: `Question ${UpdatedQuestionData.id} updated`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });

          onClose();
        } else {
          console.log(response.data);
        }
      });
  };

  const HandleEnable = () => {
    axios
      .post("http://localhost/exam-bank/api/QuestionRoute.php?action=enable", {
        id: selectedQuestion.id,
      })
      .then((response) => {
        if (response.data) {
          console.log(response.data);

          toast({
            title: "Question Enabled!",
            description: `Question ${selectedQuestion.id} enabled`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });

          onClose();
        } else {
          console.log(response.data);
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
          console.log(response.data);

          toast({
            title: "Question Disabled!",
            description: `Question ${selectedQuestion.id} disabled`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });

          onClose();
        } else {
          console.log(response.data);
        }
      });
  };

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
              user.usertype === "Coordinator") && (
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
              user.usertype === "Coordinator") && (
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
                    colorScheme="red"
                    size="sm"
                    onClick={HandleDisable}
                  >
                    Deactivate
                  </Button>
                )}
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
