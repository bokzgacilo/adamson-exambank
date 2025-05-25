import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useEffect, useState } from "react";
import { PrimeReactProvider } from "primereact/api";
import {
  Button, Divider, Heading, Input, Stack, useToast, AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Select,
  useDisclosure
} from "@chakra-ui/react";

import PropTypes from "prop-types";
import { TbEdit, TbStatusChange, TbTrash } from "react-icons/tb";
import axios from "axios";

export default function SubjectDataTable({ data, fetchSubjects, setIsEditing, modalOpen, setTargetSubject, SetSubjectName }) {
  const [globalFilter, setGlobalFilter] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [target, setTarget] = useState("")
  const [SelectedSubject, SetSelectedSubject] = useState("")
  const [newStatus, setNewStatus] = useState({
    id: "",
    status: "",
  })
  const toast = useToast()
  const [loading, setLoading] = useState(false)

  useEffect(() => {fetchSubjects()}, [])

  const setEditing = (rowData) => {
    modalOpen()
    setTargetSubject(rowData.id)
    SetSubjectName(rowData.name)
    setIsEditing(true)
  }

  const RenderActionButtons = (rowData) => {
    return (
      <>
        <Button size="sm" colorScheme="blue" mr={2} leftIcon={<TbEdit />} onClick={() => setEditing(rowData)}>
          Edit
        </Button>
        <Button size="sm" colorScheme="red" leftIcon={<TbTrash />} onClick={() => SetDeleteSubject(rowData.name)}>
          Delete
        </Button>
      </>

    )
  }

  const SetDeleteSubject = (subject_name) => {
    setTarget("delete")
    SetSelectedSubject(subject_name)
    onOpen()
  }

  const PrepareStatusChange = (id, name, value) => {
    setTarget("status")
    SetSelectedSubject(name)
    setNewStatus({
      id: id,
      status: value
    })
    onOpen()
  }

  const handleDelete = () => {
    setLoading(true)
    axios
      .post(`${import.meta.env.VITE_API_HOST}SubjectRoute.php?action=delete`, {
        subject_name: SelectedSubject,
      })
      .then((response) => {
        if(response.data){
          setLoading(false)
        }
        fetchSubjects()
        onClose();
      });

  };

  const handeChangeStatus = () => {
    setLoading(true)
    axios
      .post(`${import.meta.env.VITE_API_HOST}SubjectRoute.php?action=change_status`, newStatus)
      .then((response) => {
        if (response.data) {
          toast({
            title: "Subject Status Updated",
            description: `Subject ${SelectedSubject} status changed to ${newStatus.status_value === "0" ? "Inactive" : "Active"}`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          setLoading(false)
        }
        fetchSubjects()
        onClose();
      });
  }

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>
              <Heading size="md">{target === "status" ? "Update Status" : "Confirm Delete"}</Heading>
            </AlertDialogHeader>

            <AlertDialogBody>
              {target === "status" ?
                <>
                  Are you sure you want to change this <b>{SelectedSubject}</b>'s status to <b>{newStatus.status_value === "0" ? "Inactive" : "Active"}</b>?
                </> :
                <>
                  Are you sure you want to delete <b>{SelectedSubject}</b>? This action cannot be undone.
                </>
              }
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onClose}>
                No
              </Button>
              <Button
                leftIcon={target === "status" ? <TbStatusChange /> : <TbTrash />}
                colorScheme={target === "status" ? "green" : "red"}
                onClick={target === "status" ? handeChangeStatus : handleDelete}
                ml={4}
                isLoading={loading}
              >
                {target === "status" ? "Yes, confirm changing status" : "I confirm to delete this"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <PrimeReactProvider>
        <Stack p={4} backgroundColor="gray.200">
          <Heading size="lg">Search</Heading>
          <Input
            backgroundColor="#fff"
            type="search"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search id, name..."
          />
        </Stack>
        <Divider />
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
            field="name"
            header="Subject Name"
            filter
            sortable
          ></Column>
          <Column
            field="status"
            header="Status"
            body={(rowData) => (
              <Select
                variant="filled"
                rounded="full"
                onChange={(e) => PrepareStatusChange(rowData.id, rowData.name, e.target.value)}
                value={rowData.status === "1" ? "1" : "0"}
              >
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </Select>
            )}
          ></Column>
          <Column
            field="name"
            header="Action"
            body={RenderActionButtons}
          ></Column>
        </DataTable>
      </PrimeReactProvider>
    </>
  );
}