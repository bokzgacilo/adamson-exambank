import { Button, Heading, Stack, Flex, useDisclosure, Card, CardHeader, CardBody, Divider } from "@chakra-ui/react";
import { BiPlus } from "react-icons/bi";
import UserDataTable from "../components/UserDataTable";
import AddNewUserForm from "../components/AddNewUser";
import axios from "axios";
import { useEffect, useState } from "react";

export default function UserPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
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
      
      <Stack >
        <Card height="100dvh">
          <CardHeader backgroundColor="#141414" color="#fff">
            <Flex direction="row" alignItems="center" justifyContent="space-between">
              <Heading>Manage User</Heading>
              <Flex direction="row" gap={2}>
                <Button leftIcon={<BiPlus />} colorScheme="green" onClick={onOpen}>Add User</Button>
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
