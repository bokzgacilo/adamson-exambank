import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useRef, useState } from "react";
import { PrimeReactProvider } from "primereact/api";
import {
  Button, Divider, Heading, Input, Stack, useToast, AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Select
} from "@chakra-ui/react";

import PropTypes from "prop-types";
import { TbTrash } from "react-icons/tb";
import axios from "axios";
import { database } from "../helper/Firebase";
import { ref, set } from "firebase/database";
import useUserStore from "../helper/useUserStore";
SubjectDataTable.propTypes = {
  data: PropTypes.any.isRequired,
  fetchSubjects: PropTypes.func.isRequired
};

export default function SubjectDataTable({ data, fetchSubjects }) {
  const [globalFilter, setGlobalFilter] = useState("");

  const cancelRef = useRef()
  const cancelStatusRef = useRef()
  
  const { user } = useUserStore();
  const toast = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const onDeletelose = () => setIsDeleteOpen(false);


  const [SelectedSubject, SetSelectedSubject] = useState("")
  const [newStatusValue, setNewStatusValue] = useState("")
  const [selectedSubjectId, setSelectedSubjectId] = useState("")


  const RenderActionButtons = (rowData) => {
    return (
      <Button colorScheme="red" size="sm" leftIcon={<TbTrash />} onClick={() => SetDeleteSubject(rowData.name)}>
        Delete
      </Button>
    )
  }

  const SetDeleteSubject = (subject_name) => {
    SetSelectedSubject(subject_name)
    setIsOpen(true)
  }

  const PrepareStatusChange = (userid, status_value) => {
    setIsDeleteOpen(true)
    setSelectedSubjectId(userid)
    setNewStatusValue(status_value)
  }

  const handleDelete = () => {
    axios
      .post("http://localhost/exam-bank/api/SubjectRoute.php?action=delete", {
        subject_name: SelectedSubject,
      })
      .then((response) => {
        if (response) {
          set(ref(database, `logs/${Date.now()}`), {
            action: "Subject Deleted",
            timestamp: Date.now(),
            target: SelectedSubject,
            actor: user.fullname,
          });
        }
      });
    onClose();
  };

  const handeChangeStatus = () => {
      const data = {
        id: selectedSubjectId,
        status: newStatusValue,
      };
  
      axios
        .post(`http://localhost/exam-bank/api/SubjectRoute.php?action=change_status`, data)
        .then((response) => {
          if (response.data) {
            toast({
              title: "Subject Status Updated",
              description: `Subject ID:${selectedSubjectId} status changed to ${newStatusValue === "0" ? "Inactive" : "Active"}`,
              status: "success",
              duration: 3000,
              isClosable: true,
            });
  
            fetchSubjects()
            setIsDeleteOpen(false)
          }
        });
  
      onClose();
    }


  return (
    <PrimeReactProvider>
      <AlertDialog
          isOpen={isDeleteOpen}
          leastDestructiveRef={cancelStatusRef}
          onClose={onDeletelose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Confirm Status Change
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure you want to change this subject's status to <b>{newStatusValue === "0" ? "Inactive" : "Active"}</b>?
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelStatusRef} onClick={onDeletelose}>
                  No
                </Button>
                <Button colorScheme="blue" onClick={handeChangeStatus} ml={3}>
                  Yes
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>


      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Subject
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete <b>{SelectedSubject}</b>? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                No
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Yes
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

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
          field="name"
          header="Subject Name"
          filter
          sortable
        ></Column>
        <Column
          field="name"
          header="Action"
          body={RenderActionButtons}
        ></Column>
        <Column
          field="status"
          header="Status"
          body={(rowData) => (
            <Select
              size="sm"
              onChange={(e) => PrepareStatusChange(rowData.id, e.target.value)}
              value={rowData.status === "1" ? "1" : "0"}
            >
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </Select>
          )}
        ></Column>
      </DataTable>
    </PrimeReactProvider>
  );
}