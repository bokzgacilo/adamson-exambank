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
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter
} from '@chakra-ui/react'
import { PrimeReactProvider } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { TbEdit, TbTrash } from "react-icons/tb";
import Swal from "sweetalert2"
import { useRef } from 'react';

const NewDepartmentModal = ({ isEditing, isOpen, onClose, fetchMasterData, data }) => {
  const [DepartmentName, SetDepartmentName] = useState(data.name !== "" ? data.name : "");
  const {isOpen: AlertIsOpen, onOpen: AlertOnOpen, onClose: AlertOnClose} = useDisclosure();

  const handleCreateDepartment = async () => {
    const url = isEditing
      ? `${import.meta.env.VITE_API_HOST}ServicesRoute.php?action=update_department`
      : `${import.meta.env.VITE_API_HOST}ServicesRoute.php?action=create_department`;

    const FORMDATA = isEditing
      ? { name: DepartmentName, id: data.id }
      : { name: DepartmentName };


    await axios.post(url, FORMDATA)
      .then(response => {
        console.log(response)
        if(isEditing){
          Swal.fire("Updated!", "Department Updated", "success");
        }else {
          Swal.fire("Added!", "Department Added", "success");
        }
        SetDepartmentName("")
        fetchMasterData()
        onClose()
      })
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading size="lg">
              {isEditing ? "Edit Department" : "Create New Department"}
            </Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input type="text" value={DepartmentName} onChange={(e) => SetDepartmentName(e.currentTarget.value)} placeholder="Department Name" />
          </ModalBody>
          <ModalFooter>
            <Button  mr={4} onClick={onClose}>
              Close
            </Button>
            <Button onClick={AlertOnOpen} colorScheme='green'>{isEditing ? "Save Changes" : "Create"}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={AlertIsOpen}
        onClose={AlertOnClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {isEditing ? 'Save Changes?' : 'Create Department?'}
            </AlertDialogHeader>

            <AlertDialogBody>
              {isEditing
                ? 'Are you sure you want to save changes to this department?'
                : 'Are you sure you want to create this new department?'}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={AlertOnClose}>
                Cancel
              </Button>
              <Button colorScheme="green" onClick={handleCreateDepartment} ml={4}>
                Yes, Save Changes
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export default function DepartmentPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [MasterData, SetMasterData] = useState([]);
  const [isEditing, setIsEditing] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState([])

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
      setSelectedDepartment(rowData)
      setIsEditing(true)
      onOpen()
    };

    return (
      <HStack>
        <Button
          size="sm"
          colorScheme="blue"
          leftIcon={<TbEdit />}
          onClick={handleEdit}
        >
          Edit
        </Button>
        <Button
          size="sm"
          colorScheme="red"
          leftIcon={<TbTrash />}
          onClick={handleDelete}
        >
          Delete
        </Button>
      </HStack>
    );
  };

  const handleOnClose = () => {
    setSelectedDepartment([])
    setIsEditing(false)
    onClose()
  }

  return (
    <Stack p={0}>
      {isOpen && <NewDepartmentModal 
        isEditing={isEditing} 
        isOpen={isOpen} 
        onClose={handleOnClose} 
        fetchMasterData={fetchMasterData} 
        data={selectedDepartment}
      />}
      <Card
        height="100dvh"
      >
        <CardHeader backgroundColor="#141414"  color="#fff">
          <Flex direction="row" alignItems="center" justifyContent="space-between">
            <Heading>Manage Departments</Heading>
            <Flex direction="row" gap={2}>
              <Button leftIcon={<BiPlus />} colorScheme="green" onClick={onOpen}>Create Department</Button>
            </Flex>
          </Flex>
        </CardHeader>
        <Divider />
        <CardBody p={0}>
          <PrimeReactProvider>

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
          </PrimeReactProvider>
        </CardBody>
      </Card>
    </Stack>
  );
}
