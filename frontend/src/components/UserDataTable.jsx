import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useEffect, useState } from "react";
import { PrimeReactProvider } from "primereact/api";
import {
  Avatar,
  Divider,
  Heading,
  Input,
  Stack,
  Text,
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
  Flex,
  Icon,
} from "@chakra-ui/react";
import axios from "axios";
import { TbPlus, TbX } from "react-icons/tb";
import PropTypes from "prop-types";

UserDataTable.propTypes = {
  data: PropTypes.object.isRequired,
  fetchMasterData: PropTypes.func.isRequired,
};

export default function UserDataTable({ data, fetchMasterData }) {
  const [globalFilter, setGlobalFilter] = useState("");

  const {
    isOpen: isSecondOpen,
    onOpen: onSecondOpen,
    onClose: onSecondClose,
  } = useDisclosure();
  const {
    isOpen: isThirdOpen,
    onOpen: onThirdOpen,
    onClose: onThirdClose,
  } = useDisclosure();
  const [SelectedCredential, SetSelectedCredential] = useState(null);
  const [SelectedSubject, SetSelectedSubject] = useState("");
  const [SelectUserSubject, SetSelectUserSubject] = useState([]);
  const [AvailableSubjects, SetAvailableSubjects] = useState([]);
  const [NewPassword, SetNewPassword] = useState();
  const toast = useToast();

  const handleStatusChange = (id, newStatus) => {
    const data = {
      id: id,
      status: newStatus,
    };

    axios
      .post(
        `http://localhost/exam-bank/api/UserRoute.php?action=change_status`,
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

          fetchMasterData();
        }
      });
  };

  const StatusTemplate = (rowData) => (
    <Select
      size="sm"
      onChange={(e) => handleStatusChange(rowData.id, e.target.value)}
      value={rowData.status === "1" ? "1" : "0"}
    >
      <option value="1">True</option>
      <option value="0">False</option>
    </Select>
  );

  const renderSummary = (rowData) => {
    let items = [];

    try {
      items = JSON.parse(rowData.assigned_subject) || [];
    } catch (e) {
      console.error("Invalid JSON in assigned_subject", e);
    }

    const length = items.length;
    let label = "";

    if (length === 0) {
      label = "No Assigned Subject";
    } else if (length === 1) {
      label = items[0];
    } else if (length === 2) {
      label = `${items[0]}, ${items[1]}`;
    } else {
      label = `${items[0]}, ${items[1]}, ${length - 2} more`;
    }

    return (
      <Button
        variant="ghost"
        onClick={() => HandleShowSubjects(rowData)}
      >
        {label}
      </Button>
    );
  };

  const CredentialTemplate = (rowData) => (
    <Button size="sm" onClick={() => HandleViewCredential(rowData)}>
      View Credential
    </Button>
  );

  const HandleShowSubjects = (data) => {
    SetSelectUserSubject(JSON.parse(data.assigned_subject));
    SetSelectedCredential(data);
    onThirdOpen();
  };

  const HandleViewCredential = (data) => {
    SetSelectedCredential(data);
    SetNewPassword(data.password);
    onSecondOpen();
  };

  const ImageTemplate = (rowData) => (
    <Avatar src={"http://localhost/exam-bank/api/" + rowData.avatar} />
  );

  const HandleUpdateSubjects = () => {
    console.log(SelectUserSubject);

    const data = {
      id: SelectedCredential.id,
      userSubjects: SelectUserSubject,
    };

    axios
      .post(
        `http://localhost/exam-bank/api/UserRoute.php?action=update_subjects`,
        data
      )
      .then((response) => {
        if (response.data) {
          toast({
            title: "User subjects updated",
            status: "success",
            duration: 3000,
            isClosable: true,
          });

          onThirdClose();
          fetchMasterData();
        }
      });
  };

  const HandleUpdatePassword = () => {
    console.log(SelectUserSubject);

    const data = {
      id: SelectedCredential.id,
      password: NewPassword,
    };

    axios
      .post(
        `http://localhost/exam-bank/api/UserRoute.php?action=change_password`,
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

          fetchMasterData();
        }
      });
  };

  useEffect(() => {
    fetchMasterData();

    axios
      .get(`http://localhost/exam-bank/api/SubjectRoute.php?action=viewAll`)
      .then((response) => {
        SetAvailableSubjects(response.data);
        SetSelectedSubject(response.data[0]?.name || "");
      })
      .catch((error) => console.error("Error fetching subjects:", error));
  }, []);

  const HandleAddSubject = () => {
    if (SelectUserSubject && !SelectUserSubject.includes(SelectedSubject)) {
      SetSelectUserSubject((prev) => [...prev, SelectedSubject]);
    }
  };

  const HandleRemoveSubject = (indexToRemove) => {
    SetSelectUserSubject((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <PrimeReactProvider>
      <Modal isOpen={isThirdOpen} onClose={onThirdClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>ASSIGNED SUBJECTS</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <Flex direction="row" gap={4}>
                <Select
                  size="sm"
                  value={SelectedSubject}
                  onChange={(e) => SetSelectedSubject(e.target.value)}
                  mb={4}
                >
                  {AvailableSubjects.map((subject) => (
                    <option key={subject.id} value={subject.name}>
                      {subject.name}
                    </option>
                  ))}
                </Select>
                <Button
                  colorScheme="green"
                  size="sm"
                  onClick={HandleAddSubject}
                >
                  <Icon as={TbPlus} />
                </Button>
              </Flex>
              {SelectUserSubject.length === 0 ? (
                <Text>No Selected Subject</Text>
              ) : (
                <Stack mb={4}>
                  {SelectUserSubject.map((item, index) => (
                    <Flex
                      key={index}
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Text>
                        {index + 1}. {item}
                      </Text>
                      <Button
                        onClick={() => HandleRemoveSubject(index)}
                        size="xs"
                      >
                        <Icon as={TbX} />
                      </Button>
                    </Flex>
                  ))}
                </Stack>
              )}
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="green"
              size="sm"
              onClick={HandleUpdateSubjects}
            >
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

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
          body={renderSummary}
        ></Column>
        <Column header="Credential" body={CredentialTemplate}></Column>
        <Column
          field="status"
          header="Is Active?"
          body={StatusTemplate}
        ></Column>
      </DataTable>
    </PrimeReactProvider>
  );
}
