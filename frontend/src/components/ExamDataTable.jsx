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

  const StatusTemplate = (rowData) =>
    rowData.status === "1" ? (
      <Tag colorScheme="green">Active</Tag>
    ) : (
      <Tag colorScheme="red">Inactive</Tag>
    );

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

      axios.post(`http://localhost/exam-bank/api/ExamRoute.php?action=export`, {data: JSON.parse(SelectedExam.questions)})
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

  return (
    <PrimeReactProvider>
      <Modal
        onClose={onClose}
        isOpen={isOpen}
        scrollBehavior="outside"
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
            <Flex direction="row" gap={2}>
              <Input valie={AccessCode} onChange={(e) => SetAccessCode(e.currentTarget.value)} type="text" placeholder="Access Code"></Input>
              <Button colorScheme="blue" onClick={HandleExportToBlackboard}>Export</Button>
              {DLink !== "" && <Button onClick={() => window.open(`http://localhost:8080${DLink}`, "_blank")}>Download</Button>}
              <Button onClick={onClose}>Close</Button>
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
        globalFilter={globalFilter} // 🔍 Enable global search
      >
        <Column field="id" header="ID" sortable></Column>
        <Column
          field="exam_name"
          header="Exam Name"
          body={ExamTemplate}
          filter
          sortable
        ></Column>
        <Column field="subject" header="Subject" filter sortable></Column>
        {localStorage.getItem("usertype") !== "Instructor" && <Column field="access_code" header="Access Code" sortable></Column>}
        
        <Column field="created_by" header="Created By" sortable></Column>
        <Column
          field="approval_status"
          header="Is Approved?"
          body={StatusTemplate}
        ></Column>
        <Column field="status" header="Status" body={StatusTemplate}></Column>
      </DataTable>
    </PrimeReactProvider>
  );
}
