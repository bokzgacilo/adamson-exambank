import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useState } from "react";
import { PrimeReactProvider } from "primereact/api";
import {
  Divider,
  Heading,
  Input,
  Stack,
  Tag,
  Text,
  Button
} from "@chakra-ui/react";

import PropTypes from "prop-types";
import useUserStore from "../helper/useUserStore";

ExamDataTable.propTypes = {
  data: PropTypes.any.isRequired,
  SetSelectedExam: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired
};

export default function ExamDataTable({ data, SetSelectedExam, onOpen }) {
  const [globalFilter, setGlobalFilter] = useState("");
  const {user} = useUserStore();

  const StatusTemplate = (rowData) => {
    return <Tag size="sm" colorScheme={rowData.status === 1 ? "green" : "red"}>{rowData.status === 1 ? "Active" : "Inactive"}</Tag>
  }

  const NumberOfItems = (rowData) => {
    const counts = JSON.parse(rowData.questions);
    return <Text>{counts.length}</Text>
  } 

  const openDrawer = (exam) => {
    SetSelectedExam(exam)
    onOpen()
  }

  const ExamTemplate = (rowData) => (
    <Button variant="link" onClick={() => openDrawer(rowData)}>
      {rowData.exam_name}
    </Button>
  );
  
  return (
    <PrimeReactProvider>
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
        {user.usertype !== "Instructor" && <Column field="access_code" header="Access Code" sortable></Column>
        }
        <Column field="created_by" header="Created By" sortable></Column>
        <Column field="status" header="Status" body={StatusTemplate}></Column>
      </DataTable>
    </PrimeReactProvider>
  );
}
