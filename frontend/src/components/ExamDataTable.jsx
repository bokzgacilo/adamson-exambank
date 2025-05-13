import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useState } from "react";
import { PrimeReactProvider } from "primereact/api";
import {
  Divider,
  Heading,
  Input,
  Stack,
  Select,
  Text,
  useToast,
  Button
} from "@chakra-ui/react";
import axios from "axios"
import Swal from 'sweetalert2'
import PropTypes from "prop-types";
import useUserStore from "../helper/useUserStore";
import { TbTrash } from "react-icons/tb";

ExamDataTable.propTypes = {
  data: PropTypes.any.isRequired,
  SetSelectedExam: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
  getAllExams: PropTypes.func.isRequired
};

export default function ExamDataTable({ getAllExams, data, SetSelectedExam, onOpen }) {
  const [globalFilter, setGlobalFilter] = useState("");
  const {user} = useUserStore();
  const toast = useToast()
  
  const handleStatusChange = (id, newStatus) => {
      const data = {
        id: id,
        status: newStatus,
      };
  
      axios
        .post(
          `http://localhost/exam-bank/api/ExamRoute.php?action=change_status`,
          data
        )
        .then((response) => {
          if (response.data) {
            toast({
              title: `Exam ${id} updated`,
              status: "success",
              duration: 3000,
              isClosable: true,
            });

            getAllExams();
          }
        });
    };

  const StatusTemplate = (rowData) => (
      <Select
        size="sm"
        onChange={(e) => handleStatusChange(rowData.id, e.target.value)}
        value={rowData.status === 1 ? 1 : 0}
        disabled={user.usertype === "Instructor" ? true : false}
      >
        <option value="1">Active</option>
        <option value="0">Inactive</option>
      </Select>
    );

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

  const actionTemplate = (rowData) => {
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e53e3e', // Chakra red.500
      cancelButtonColor: '#a0aec0',  // Chakra gray.400
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await axios.post(`http://localhost/exam-bank/api/ExamRoute.php?action=delete`, {
          id: rowData.id
        });
        Swal.fire('Deleted!', 'The record has been deleted.', 'success');
        getAllExams();
      } catch (error) {
        Swal.fire('Error!', 'Failed to delete.', 'error');
        console.error('Delete failed:', error);
      }
    }
  };

  return (
    <Button
      leftIcon={<TbTrash />}
      colorScheme="red"
      size="sm"
      onClick={handleDelete}
    >
      Delete
    </Button>
  );
};
  
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
        <Column
          field="status"
          header="Status"
          body={StatusTemplate}
        ></Column>
        {user.usertype !== 'Instructor' && (
          <Column
            field="status"
            header="Action"
            body={actionTemplate}
          />
        )}
      </DataTable>
    </PrimeReactProvider>
  );
}
