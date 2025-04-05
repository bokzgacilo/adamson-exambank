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
    await axios.get(`http://localhost/exam-bank/api/UserRoute.php?action=viewAll`)
    .then(response => {
      SetMasterData(response.data)
    });

    console.log("fetch")
  }

  useEffect(() => {fetchMasterData()}, [])

  return (
    <Stack>
      <AddNewUserForm fetchMasterData={fetchMasterData} onClose={onClose} isOpen={isOpen} onOpen={onOpen}  />
      <Stack p={4}>
        <Card>
          <CardHeader backgroundColor="#2b2b2b" color="#fff">
            <Flex direction="row" alignItems="center" justifyContent="space-between">
              <Heading size="md">USER MANAGEMENT</Heading>
              <Flex direction="row" gap={2}>
                <Button leftIcon={<BiPlus />} colorScheme="green" size="sm" onClick={onOpen}>Add User</Button>
              </Flex>
            </Flex>
          </CardHeader>
          <Divider />
          <CardBody p={4}>
            <UserDataTable data={MasterData} fetchMasterData={fetchMasterData} />
          </CardBody>
        </Card>
      </Stack>
    </Stack>
  );
}
