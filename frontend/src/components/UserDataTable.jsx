import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useEffect, useRef, useState } from "react";
import { PrimeReactProvider } from "primereact/api";
import Swal from 'sweetalert2'
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
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter
} from "@chakra-ui/react";
import axios from "axios";
import { TbPlus, TbTrash, TbX } from "react-icons/tb";
import PropTypes from "prop-types";
import { ref, set } from "firebase/database";
import { database } from "../helper/Firebase";
import useUserStore from "../helper/useUserStore";
import AssignSubjectSelector from "./composites/AssignSubjectSelector";

export default function UserDataTable({ data, fetchMasterData }) {
  const [globalFilter, setGlobalFilter] = useState("");
  const { user } = useUserStore()

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

  const {
    isOpen: isDepartmentOpen,
    onOpen: onDepartmentOpen,
    onClose: onDepartmentClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const {
    isOpen: isOpenConfirmType,
    onOpen: onOpenConfirmType,
    onClose: onCloseConfirmType,
  } = useDisclosure();

  const [isOpen, setIsOpen] = useState(false);

  const [IsLoading, SetIsLoading] = useState(false)
  const [SelectedCredential, SetSelectedCredential] = useState(null);
  const [SelectedDepartment, SetSelectedDepartment] = useState("");
  const [SelectUserSubject, SetSelectUserSubject] = useState([]);
  const [SelectUserDepartment, SetSelectUserDepartment] = useState([]);
  const [AvailableDepartment, SetAvailableDepartment] = useState([]);
  const [NewPassword, SetNewPassword] = useState();
  const toast = useToast();
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef()
  const [selectedUser, setSelectedUser] = useState("")


  const [selectedUserId, setSelectedUserId] = useState("")
  const [newStatusValue, setNewStatusValue] = useState("")

  const [newType, setNewType] = useState("")

  const prepareTypeChange = (userid, new_type) => {
    onOpenConfirmType()
    setSelectedUserId(userid)
    setNewType(new_type)
  }

  const PrepareStatusChange = (userid, status_value) => {
    setIsOpen(true)
    setSelectedUserId(userid)
    setNewStatusValue(status_value)
  }

  const handleChangeType = () => {
    const data = {
      id: selectedUserId,
      type: newType,
    };

    axios
      .post(`${import.meta.env.VITE_API_HOST}UserRoute.php?action=change_type`, data)
      .then((response) => {
        if (response.data) {
          toast({
            title: "User Updated",
            description: `User ${selectedUserId} type changed to ${newType}`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        }
        
        setNewType("")
        fetchMasterData();
      });

    onCloseConfirmType();
  }

  const handeChangeStatus = () => {
    const data = {
      id: selectedUserId,
      status: newStatusValue,
    };

    axios
      .post(`${import.meta.env.VITE_API_HOST}UserRoute.php?action=change_status`, data)
      .then((response) => {
        if (response.data) {
          toast({
            title: "User Updated",
            description: `User ${selectedUserId} status changed to ${newStatusValue === "0" ? "Inactive" : "Active"}`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        }
        
        fetchMasterData();
      });

    onClose();
  }

  const StatusTemplate = (rowData) => (
    <Select
      size="sm"
      variant="filled"
      rounded="full"
      onChange={(e) => PrepareStatusChange(rowData.id, e.target.value)}
      value={rowData.status === "1" ? "1" : "0"}
    >
      <option value="1">Active</option>
      <option value="0">Inactive</option>
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
        size="sm"
        onClick={() => HandleShowSubjects(rowData)}
      >
        {label}
      </Button>
    );
  };
  const renderDepartments = (rowData) => {
    let items = [];

    try {
      items = JSON.parse(rowData.assigned_department) || [];
    } catch (e) {
      console.error("Invalid JSON in assigned_subject", e);
    }

    const length = items.length;
    let label = "";

    if (length === 0) {
      label = "No Assigned Department";
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
        size="sm"
        onClick={() => HandleShowDepartments(rowData)}
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

  const HandleShowDepartments = (data) => {
    SetSelectUserDepartment(JSON.parse(data.assigned_department));
    SetSelectedCredential(data);
    onDepartmentOpen();
  };

  const HandleViewCredential = (data) => {
    SetSelectedCredential(data);
    SetNewPassword(data.password);
    onSecondOpen();
  };

  const ImageTemplate = (rowData) => (
    <Avatar src={import.meta.env.VITE_API_HOST + rowData.avatar} />
  );

  const HandleUpdateDepartment = () => {
    onDepartmentClose();

    const data = {
      id: SelectedCredential.id,
      userDepartments: SelectUserDepartment,
    };

    Swal.fire({
      title: "Adding Departments",
      text: "Are you sure you want to assigned these departments?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, confirm changes"
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(
            `${import.meta.env.VITE_API_HOST}UserRoute.php?action=update_departments`,
            data
          )
          .then((response) => {
            if (response.data) {
              toast({
                title: "User department updated",
                status: "success",
                duration: 3000,
                isClosable: true,
              });

              onDepartmentClose();
              fetchMasterData();
            }
          });
      }
    });
  };

  const HandleUpdateSubjects = () => {
    onThirdClose();

    const data = {
      id: SelectedCredential.id,
      userSubjects: SelectUserSubject,
    };

    Swal.fire({
      title: "Adding Subjects",
      text: "Are you sure you want to assigned these subjects?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, confirm changes"
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .post(
            `${import.meta.env.VITE_API_HOST}UserRoute.php?action=update_subjects`,
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
      }
    });
  };

  const handleResetPassword = async () => {
    SetIsLoading(true)

    await axios.post(`${import.meta.env.VITE_API_HOST}ServicesRoute.php?action=reset_password`, {
      email: SelectedCredential.username,
    }, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(response => {
        let status = "warning";

        if (response.data.status === "success") {
          status = "success";
        }

        toast({
          title: response.data.message,
          description: response.data.description,
          status: status,
          duration: 4000,
          isClosable: true,
        });

        SetIsLoading(false)
      })
  }

  useEffect(() => {
    if (!isDepartmentOpen) return;
    axios
      .get(`${import.meta.env.VITE_API_HOST}ServicesRoute.php?action=get_all_departments`)
      .then((response) => {
        SetAvailableDepartment(response.data);
        SetSelectedDepartment(response.data[0]?.name || "");
      })
      .catch((error) => console.error("Error fetching subjects:", error));
  }, [isDepartmentOpen])

  const HandleAddDepartment = () => {
    if (SelectUserDepartment && !SelectUserDepartment.includes(SelectedDepartment)) {
      SetSelectUserDepartment((prev) => [...prev, SelectedDepartment]);
    }
  };

  const HandleRemoveDepartment = (indexToRemove) => {
    SetSelectUserDepartment((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };


  const RenderActionButtons = (rowData) => {
    return (
      <Button colorScheme="red" size="sm" leftIcon={<TbTrash />} onClick={() => SetSelectedUserToDelete(rowData.id)}>
        Delete
      </Button>
    )
  }

  const SetSelectedUserToDelete = (user_id) => {
    setSelectedUser(user_id)
    onDeleteOpen()
  }

  const handleDelete = () => {
    axios
      .post(`${import.meta.env.VITE_API_HOST}UserRoute.php?action=delete`, {
        id: selectedUser,
      })
      .then((response) => {
        if (response) {
          set(ref(database, `logs/${Date.now()}`), {
            action: "User Deleted",
            timestamp: Date.now(),
            target: selectedUser,
            actor: user.fullname,
          });
        }

        fetchMasterData();
      });
    onDeleteClose();
  };

   const TypeTemplate = (rowData) => (
    <Select
      variant="filled"
      rounded="full"
      value={rowData.type}
      onChange={(e) => prepareTypeChange(rowData.id, e.target.value)}
      size="sm"
    >
      {["Instructor", "Coordinator"].map((type, index) => (
        <option key={index} value={type}>
          {type}
        </option>
      ))}
    </Select>
  );

  return (
    <PrimeReactProvider>
      <AlertDialog
        isOpen={isOpenConfirmType}
        onClose={onCloseConfirmType}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>
              <Heading size="lg">Change Type</Heading>
            </AlertDialogHeader>

            <AlertDialogBody>
              <Text fontSize="16px" noOfLines={2}>
                Are you sure you want to change user type to <strong>{newType}</strong>?
              </Text>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onCloseConfirmType}>
                No
              </Button>
              <Button colorScheme="green" onClick={handleChangeType} ml={3}>
                Yes, change it.
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader><Heading size="lg">Confirm Delete?</Heading>

            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this user?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onDeleteClose}>
                No
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Yes, Confirm delete.
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
            <AlertDialogHeader><Heading size="lg">Confirm Status Change?</Heading>
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to change this user's status to <b>{newStatusValue === "0" ? "Inactive" : "Active"}</b>?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                No
              </Button>
              <Button colorScheme="blue" onClick={handeChangeStatus} ml={3}>
                Yes, Confirm changing status.
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {isDepartmentOpen && <Modal isOpen={isDepartmentOpen} onClose={onDepartmentClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader><Heading size="lg">Assign Department</Heading></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <Flex direction="row" gap={4}>
                <Select
                  value={SelectedDepartment}
                  onChange={(e) => SetSelectedDepartment(e.target.value)}
                  mb={4}
                >
                  {AvailableDepartment
                    .filter(department => !SelectUserDepartment.includes(department.name))
                    .map((department, index) => (
                      <option key={index} value={department.name}>
                        {department.name}
                      </option>
                    ))}
                </Select>
                <Button
                  colorScheme="green"
                  onClick={HandleAddDepartment}
                >
                  <Icon as={TbPlus} />
                </Button>
              </Flex>
              {SelectUserDepartment.length === 0 ? (
                <Text>No Selected Department</Text>
              ) : (
                <Stack mb={4}>
                  {SelectUserDepartment.map((item, index) => (
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
                        onClick={() => HandleRemoveDepartment(index)}
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
              mr={4}
              onClick={onDepartmentClose}
            >Close</Button>
            <Button
              colorScheme="green"
              onClick={HandleUpdateDepartment}
            >
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>}

      {isThirdOpen && <Modal isOpen={isThirdOpen} onClose={onThirdClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader><Heading size="lg">Assign Subject</Heading></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <AssignSubjectSelector 
                data={{
                    user_subjects: SelectUserSubject,
                    set_user_subject: SetSelectUserSubject,
                  }}
              />
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button
              mr={4}
              onClick={onThirdClose}
            >Close</Button>
            <Button
              colorScheme="green"
              onClick={HandleUpdateSubjects}
            >
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>}


      {isSecondOpen && <Modal isOpen={isSecondOpen} onClose={onSecondClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader><Heading size="lg">Credential</Heading></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              {SelectedCredential !== null && (
                <>
                  <Text fontWeight="semibold">Username</Text>
                  <Input value={SelectedCredential.username} isReadOnly />
                  <Text fontWeight="semibold">Password</Text>
                  <Input
                    type="password"
                    value={NewPassword}
                    onChange={(e) => SetNewPassword(e.currentTarget.value)}
                  />
                </>
              )}
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button mr={4} onClick={onSecondClose}>Close</Button>
            <Button isLoading={IsLoading}
              loadingText="Resetting..." colorScheme="green" onClick={handleResetPassword}>
              Reset Password
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>}


      <Stack
        p={4}
        backgroundColor="gray.200"
      >
        <Heading size="lg">Search</Heading>
        <Input
          backgroundColor="#fff"
          type="text"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search name, type, assigned subject, assigned department..."
        />
      </Stack>
      <Divider />
      <DataTable
        size="small"
        value={data}
        paginator
        rows={10}
        rowsPerPageOptions={[10, 15, 30]}
        showGridlines
        globalFilter={globalFilter} // 🔍 Enable global search
      >
        <Column field="avatar" header="Image" body={ImageTemplate}></Column>
        <Column field="name" header="Name" sortable></Column>
         <Column
          field="type"
          header="Type"
          body={TypeTemplate}
          sortable
        ></Column>
        <Column
          field="assigned_subject"
          header="Assigned Subject"
          body={renderSummary}
        ></Column>
        <Column
          field="assigned_department"
          header="Assigned Department"
          body={renderDepartments}
        ></Column>
        <Column header="Credential" body={CredentialTemplate}></Column>
        <Column
          field="status"
          header="Is Active?"
          body={StatusTemplate}
        ></Column>
        <Column
          field="id"
          header="Action"
          body={RenderActionButtons}
        ></Column>
      </DataTable>
    </PrimeReactProvider>
  );
}
