import { Button, Heading, Stack, Flex, useDisclosure, Card, CardHeader, CardBody, Divider } from "@chakra-ui/react";
import axios from 'axios';
import { useEffect, useState } from "react";
import { BiPlus } from "react-icons/bi";
import UserDataTable from "../components/UserDataTable";
import AddNewUserForm from "../components/AddNewUser";

export default function UserPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [Users, SetUsers] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost/exam-bank/api/UserRoute.php?action=viewAll`)
      .then(response => {
        SetUsers(response.data)
      });
  }, []);

  return (
    <Stack>
      <AddNewUserForm onClose={onClose} isOpen={isOpen} onOpen={onOpen}  />
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
            <UserDataTable data={Users}/>
          </CardBody>
        </Card>
        
      </Stack>
    </Stack>
  );
}
