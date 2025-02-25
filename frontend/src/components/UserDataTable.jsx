import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useState } from "react";
import { PrimeReactProvider } from "primereact/api";
import {
  Avatar,
  Divider,
  Heading,
  Input,
  Stack,
  Tag,
  useToast,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  Button,
  useDisclosure,
  Select,
} from "@chakra-ui/react";
import axios from "axios";
import PropTypes from "prop-types";
UserDataTable.propTypes = {
  data: PropTypes.any.isRequired,
};

export default function UserDataTable({ data }) {
  const [globalFilter, setGlobalFilter] = useState("");
  const {
    isOpen: isSecondOpen,
    onOpen: onSecondOpen,
    onClose: onSecondClose,
  } = useDisclosure();
  const [SelectedCredential, SetSelectedCredential] = useState(null);
  const [NewPassword, SetNewPassword] = useState();
  const toast = useToast();

  const handleStatusChange = (id, newStatus) => {
    const data = {
      id: id,
      status: newStatus
    }

    axios
      .post(
        `http://localhost:8080/api/UserRoute.php?action=change_status`,
        data
      )
      .then((response) => {
        if (response.data) {
          toast({
            title: "User Updated",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        }
      });
  };

  const StatusTemplate = (rowData) => <Select onChange={(e) => handleStatusChange(rowData.id, e.target.value)} value={rowData.status === "1" ? "1" : "0"}>
    <option value="1">True</option>
    <option value="0">False</option>
  </Select>

  const CredentialTemplate = (rowData) => (
    <Button size="sm" onClick={() => HandleViewCredential(rowData)}>
      View Credential
    </Button>
  );

  const HandleViewCredential = (data) => {
    SetSelectedCredential(data);
    SetNewPassword(data.password);
    onSecondOpen();
  };

  const ImageTemplate = (rowData) => <Avatar src={rowData.avatar} />;

  const HandleUpdatePassword = () => {
    const data = {
      id: SelectedCredential.id,
      password: NewPassword,
    };

    axios
      .post(
        `http://localhost:8080/api/UserRoute.php?action=change_password`,
        data
      )
      .then((response) => {
        if (response.data) {
          toast({
            title: "Password Updated",
            description: "User can now user newly created password",
            status: "success",
            duration: 3000,
            isClosable: true,
          });

          onSecondClose();
        }
      });
  };

  return (
    <PrimeReactProvider>
      <Modal isOpen={isSecondOpen} onClose={onSecondClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Credential</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              {SelectedCredential !== null && (
                <>
                  <Heading size="md">Username</Heading>
                  <Input value={SelectedCredential.username} isReadOnly />
                  <Heading size="md">Password</Heading>
                  <Input
                    value={NewPassword}
                    onChange={(e) => SetNewPassword(e.currentTarget.value)}
                  />
                </>
              )}
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="green" mr={2} onClick={HandleUpdatePassword}>
              Update Password
            </Button>
            <Button onClick={onSecondClose}>Close</Button>
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
        <Column field="avatar" header="Image" body={ImageTemplate}></Column>
        <Column field="name" header="Name" sortable></Column>
        <Column field="type" header="Type" filter sortable></Column>
        <Column
          field="assigned_subject"
          header="Assigned Subject"
          sortable
        ></Column>
        <Column header="Credential" body={CredentialTemplate}></Column>
        <Column field="status" header="Is Active?" body={StatusTemplate}></Column>
      </DataTable>
    </PrimeReactProvider>
  );
}
