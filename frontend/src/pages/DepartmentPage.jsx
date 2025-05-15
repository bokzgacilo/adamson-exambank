import { Button, Heading, Stack, Flex, useDisclosure, Card, Input, CardHeader, CardBody, Divider, HStack } from "@chakra-ui/react";
import { BiPlus } from "react-icons/bi";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { PrimeReactProvider } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { TbEdit, TbTrash } from "react-icons/tb";
import Swal from "sweetalert2"

const NewDepartmentModal = ({ isOpen, onClose, fetchMasterData }) => {
  const [DepartmentName, SetDepartmentName] = useState("");

  const handleCreateDepartment = async () => {
    await axios.post(`${import.meta.env.VITE_API_HOST}ServicesRoute.php?action=create_department`, {
      name: DepartmentName
    })
      .then(response => {
        onClose()
        Swal.fire("Added!", "Department Added", "success");
        SetDepartmentName("")
        fetchMasterData()
      })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Department</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input type="text" value={DepartmentName} onChange={(e) => SetDepartmentName(e.currentTarget.value)} placeholder="Department Name" />
        </ModalBody>
        <ModalFooter>
          <Button size="sm" mr={2} onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleCreateDepartment} colorScheme='green' size="sm">Create</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}



export default function DepartmentPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [MasterData, SetMasterData] = useState([]);

  const fetchMasterData = async () => {
    await axios.get(`${import.meta.env.VITE_API_HOST}ServicesRoute.php?action=get_all_departments`)
      .then(res => {
        SetMasterData(res.data)
      });
  }

  useEffect(() => { fetchMasterData() }, [])

  const actionTemplate = (rowData) => {
    const handleDelete = () => {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#e53e3e", // Chakra's red.500
        cancelButtonColor: "#718096",  // Chakra's gray.500
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await axios.post(
              `${import.meta.env.VITE_API_HOST}ServicesRoute.php?action=delete_department`,
              { id: rowData.id }
            );
            Swal.fire("Deleted!", response.data.message, "success");
            fetchMasterData(); // Call this to reload table
          } catch (error) {
            console.error("Delete failed:", error);
            Swal.fire("Error", "Failed to delete department", "error");
          }
        }
      });
    };

    const handleEdit = () => {
      openEditModal(rowData); // You must define this function
    };

    return (
      <HStack spacing={2}>
        <Button
          size="xs"
          colorScheme="blue"
          leftIcon={<TbEdit />}
          onClick={handleEdit}
        >
          Edit
        </Button>
        <Button
          size="xs"
          colorScheme="red"
          leftIcon={<TbTrash />}
          onClick={handleDelete}
        >
          Delete
        </Button>
      </HStack>
    );
  };


  return (
    <PrimeReactProvider>
      <Stack>
        <Stack p={2}>
          <NewDepartmentModal isOpen={isOpen} onClose={onClose} fetchMasterData={fetchMasterData} />
          <Card>
            <CardHeader backgroundColor="#2b2b2b" color="#fff">
              <Flex direction="row" alignItems="center" justifyContent="space-between">
                <Heading size="md">Department List</Heading>
                <Flex direction="row" gap={2}>
                  <Button leftIcon={<BiPlus />} colorScheme="green" size="sm" onClick={onOpen}>Create New Department</Button>
                </Flex>
              </Flex>
            </CardHeader>
            <Divider />
            <CardBody p={0}>
              <DataTable
                value={MasterData}
                paginator
                rows={10}
                rowsPerPageOptions={[10, 15, 30]}
                showGridlines
                size="small"
              >
                <Column
                  field="id"
                  header="ID"
                ></Column>
                <Column
                  field="name"
                  header="Name"
                ></Column>
                <Column
                  field="id"
                  header="Action"
                  body={actionTemplate}
                ></Column>
              </DataTable>
            </CardBody>
          </Card>
        </Stack>
      </Stack>
    </PrimeReactProvider>

  );
}
