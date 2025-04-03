import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useState } from "react";
import { PrimeReactProvider } from "primereact/api";
import {
  Textarea,
  RadioGroup,
  Radio,
  Divider,
  Heading,
  Input,
  Modal,
  ModalBody,
  Flex,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Tag,
  Text,
  ModalFooter,
  useToast
} from "@chakra-ui/react";
import { Button, useDisclosure } from "@chakra-ui/react";

import PropTypes from "prop-types";
import axios from "axios";
import { ref, set } from "firebase/database";
import { database } from "../helper/Firebase";
import useUserStore from "../helper/useUserStore";
ExamDataTable.propTypes = {
  data: PropTypes.any.isRequired,
};

export default function ExamDataTable({ data }) {
  const [globalFilter, setGlobalFilter] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [SelectedExam, SetSelectedExam] = useState(null);
  const [AccessCode, SetAccessCode] = useState("")
  const [DLink, SetLink] = useState("")
  const toast = useToast();
  const {user} = useUserStore();

  const StatusTemplate = (rowData) => {
    return <Tag size="sm" colorScheme={rowData.status === "1" ? "green" : "red"}>{rowData.status === "1" ? "Active" : "Inactive"}</Tag>
  }

  const NumberOfItems = (rowData) => {
    const counts = JSON.parse(rowData.questions);
    return <Text>{counts.length}</Text>
  } 

  const ExamTemplate = (rowData) => (
    <Button variant="link" onClick={() => openDrawer(rowData)}>
      {rowData.exam_name}
    </Button>
  );

  const openDrawer = (rowData) => {
    SetSelectedExam(rowData);
    onOpen();
  };

  const renderFormElement = (options, category) => {
    switch (category) {
      case "Identification": {
        return (
          <Input size="sm" value={JSON.parse(options)[0].option} readOnly />
        );
      }
      case "Enumeration": {
        const TextAreaValue = JSON.parse(options)
          .map((item) => item.option)
          .join("\n");

        return (
          <Textarea
            size="sm"
            value={TextAreaValue}
            placeholder="Enter answers"
            isReadOnly={true}
          />
        );
      }
      case "True/False": {
        return (
          <RadioGroup>
            <Stack spacing={2}>
              {JSON.parse(options).map((option) => (
                <Radio key={option.id} isChecked={option.is_correct}>
                  {option.option}
                </Radio>
              ))}
            </Stack>
          </RadioGroup>
        );
      }

      case "Multiple":
        return (
          <RadioGroup>
            <Stack spacing={4}>
              {JSON.parse(options).map((option) => (
                <Flex
                  key={option.id}
                  direction="row"
                  alignItems="center"
                  gap={4}
                >
                  <Radio isChecked={option.is_correct} />
                  <Input size="sm" type="text" value={option.option} readOnly />
                </Flex>
              ))}
            </Stack>
          </RadioGroup>
        );
      default:
        return null;
    }
  };

  const HandleExportToBlackboard = () => {
    if(AccessCode === SelectedExam.access_code){
      toast({
        title: 'Access Granted',
        description: "Click the download button to download file",
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      axios.post(`http://localhost/exam-bank/api/ExamRoute.php?action=export`, {data: JSON.parse(SelectedExam.questions), subject: SelectedExam.subject})
      .then(response => {
        SetLink(response.data)
      });
    }else {
      toast({
        title: 'Error Access Code',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const HandleDelete = () => {
    axios
    .post("http://localhost/exam-bank/api/ExamRoute.php?action=delete", {
      id: SelectedExam.id,
    })
    .then((response) => {
      console.log(response)

      if (response.data) {
        toast({
          title: "Exam Deleted!",
          description: `${SelectedExam.exam_name} deleted`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        set(ref(database, `logs/${Date.now()}`), { action: "Exam Deleted", timestamp: Date.now(), target: SelectedExam.exam_name, actor: user.fullname });
        onClose();
      }
    });
  }
  const ExamDetailOnClose = () => {
    SetAccessCode(0)
    SetLink("")
    SetSelectedExam(null)
    onClose()
  }

  return (
    <PrimeReactProvider>
      <Modal
        onClose={ExamDetailOnClose}
        isOpen={isOpen}
        scrollBehavior="outside"
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          {SelectedExam === null ? (
            <>
              <ModalHeader>No Selected Exam</ModalHeader>
            </>
          ) : (
            <>
              <ModalHeader>{SelectedExam.exam_name}</ModalHeader>
              <ModalBody>
              <Stack spacing={4}>
                  {JSON.parse(SelectedExam.questions).map((question, index) => 
                    <Stack key={question.id}>
                      <Text fontWeight="semibold">{index + 1}. {question.question}</Text>
                      {renderFormElement(question.options, question.category)}
                    </Stack>
                  )}
                </Stack>
              </ModalBody>
            </>
          )}
          <ModalFooter>
            <Flex direction="row" justifyContent="space-between" gap={2}>
              <Input size="sm" value={AccessCode} onChange={(e) => SetAccessCode(e.currentTarget.value)} type="text" placeholder="Access Code"></Input>
              {DLink !== "" ? <Button size="sm" onClick={() => window.open(`http://localhost/exam-bank/api/${DLink}`, "_blank")}>Download</Button> : <Button size="sm" colorScheme="blue" onClick={HandleExportToBlackboard}>Export</Button>}
              <Button size="sm" colorScheme="red" onClick={HandleDelete}>Delete</Button>
              <Button size="sm" onClick={ExamDetailOnClose}>Close</Button>
            </Flex>
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
        globalFilter={globalFilter}
      >
        <Column field="id" header="ID" sortable></Column>
        <Column
          field="exam_name"
          header="Exam Name"
          body={ExamTemplate}
          filter
          sortable
        ></Column>
        <Column field="questions" header="Items" body={NumberOfItems}></Column>
        <Column field="subject" header="Subject" filter></Column>
        {localStorage.getItem("usertype") !== "Instructor" && <Column field="access_code" header="Access Code" sortable></Column>}
        
        <Column field="created_by" header="Created By" sortable></Column>
        <Column field="status" header="Status" body={StatusTemplate}></Column>
      </DataTable>
    </PrimeReactProvider>
  );
}
