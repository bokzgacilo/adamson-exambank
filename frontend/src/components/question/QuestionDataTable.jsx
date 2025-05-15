import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useState } from "react";
import { PrimeReactProvider } from "primereact/api";
import {
  Divider,
  Heading,
  Stack,
  Input,
  Tag,
  Text,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";

import QuestionDetail from "./QuestionDetail";

export default function QuestionDataTable({ data, refreshTable }) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [updatedQuestionData, setUpdatedQuestionData] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedQuestion, setSelectedQuestion] = useState(null);

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

  return (
    <>
      <Stack
        p={4}
        backgroundColor="gray.200"
      >
        <Heading size="lg">Search</Heading>
        <Input
          type="search"
          backgroundColor="#fff"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search question name, type, terms, department, creator"
        />
      </Stack>
      <QuestionDetail refreshTable={refreshTable} updatedQuestionData={updatedQuestionData} setUpdatedQuestionData={setUpdatedQuestionData} isOpen={isOpen} onClose={onClose} selectedQuestion={selectedQuestion} setSelectedQuestion={setSelectedQuestion} isEditing={isEditing} setIsEditing={setIsEditing} />

      <Divider />
      <PrimeReactProvider>
        <DataTable
          value={data}
          paginator
          rows={10}
          rowsPerPageOptions={[10, 15, 20]}
          showGridlines
          size="small"
          globalFilter={globalFilter}
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
            field="terms"
            header="Terms"
            sortable
            filter
            filterField="terms"
            body={(rowData) => {
              let terms = JSON.parse(rowData.terms)
              return terms.join(', ')
            }}
            filterFunction={(value, filter) =>
              value ? value.some(term => term.toLowerCase().includes(filter.toLowerCase())) : false
            }
          ></Column>
          <Column
            showFilterMenu={true}
            field="department"
            filter
            header="Department"
            sortable
          ></Column>
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
            field="created_by"
            header="Created By"
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
    </>
  );
}
