import { Button, Heading, Stack, Flex, useDisclosure, Card, CardHeader, CardBody, Divider, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Input, useToast } from "@chakra-ui/react";
import { BiPlus } from "react-icons/bi";
import UserDataTable from "../components/UserDataTable";
import AddNewUserForm from "../components/AddNewUser";
import axios from "axios";
import { useEffect, useState } from "react";
import { TbFileExcel, TbUser, TbUsersPlus } from "react-icons/tb";

const BatchUserModal = ({isOpen, onClose, refreshTable}) => {
  const [File, SetFile] = useState(null)
  const toast = useToast();

  const handleDownloadTemplate = () => {
    const link = document.createElement("a");
    link.href = `${import.meta.env.VITE_HOST}BATCH_USER.xlsx`;
    link.download = "BATCH_USER.xlsx";
    link.click();
  }

  const HandeFileChange = (e) => {
    SetFile(e.target.files[0]);
  };

  const handleImportBatch =  async () => {
    const formData = new FormData();

    if(!File){
      alert("Please upload file")
      return
    }

    formData.append("file", File);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_HOST}ServicesRoute.php?action=upload_batch_user`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const data = response.data;
      toast({
        title: data.message || "Import completed",
        description: `Total rows: ${data.total_rows || 0}. Inserted: ${data.rows || 0}. Skipped: ${data.skipped_usernames?.length || 0}`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      console.log(response.data);
      refreshTable()
      SetFile(null)
      onClose()
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  }

  return <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>
        <ModalCloseButton />
        <Heading size="lg">Batch Import Users</Heading>
      </ModalHeader>
      <ModalBody>
        <FormControl isRequired>
          <FormLabel>Excel File</FormLabel>
          <Input type="file" accept=".csv, .xlsx" onChange={HandeFileChange} />
        </FormControl>
      </ModalBody>
      <ModalFooter>
        <Button mr={4} onClick={onClose}>Close</Button>
        <Button leftIcon={<TbFileExcel />} mr={4} onClick={handleDownloadTemplate}>Template</Button>
        <Button colorScheme="green" leftIcon={<TbUsersPlus />} onClick={handleImportBatch}>Import</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
}

export default function UserPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {isOpen: isOpenBatchModal, onOpen: onOpenBatchModal, onClose: onCloseBatchModal} = useDisclosure();

  const [MasterData, SetMasterData] = useState([]);

  const fetchMasterData = async () => {
    await axios.get(`${import.meta.env.VITE_API_HOST}UserRoute.php?action=viewAll`)
    .then(response => {
      SetMasterData(response.data)
    });
  }

  useEffect(() => {fetchMasterData()}, [])

  return (
    <Stack>
      {isOpen && <AddNewUserForm fetchMasterData={fetchMasterData} onClose={onClose} isOpen={isOpen} onOpen={onOpen}  />}
      {isOpenBatchModal && <BatchUserModal refreshTable={fetchMasterData} isOpen={isOpenBatchModal} onClose={onCloseBatchModal} />}

      <Stack >
        <Card height="100dvh">
          <CardHeader backgroundColor="#141414" color="#fff">
            <Flex direction="row" alignItems="center" justifyContent="space-between">
              <Heading>Manage User</Heading>
              <Flex direction="row" gap={2}>
                <Button leftIcon={<TbUser />} colorScheme="green" onClick={onOpen}>Add Single</Button>
                <Button leftIcon={<TbUsersPlus />} colorScheme="green" onClick={onOpenBatchModal}>Import Batch</Button>
              </Flex>
            </Flex>
          </CardHeader>
          <Divider />
          <CardBody p={0}>
            <UserDataTable data={MasterData} fetchMasterData={fetchMasterData} />
          </CardBody>
        </Card>
      </Stack>
    </Stack>
  );
}
