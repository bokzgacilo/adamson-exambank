import {
  Flex,
  Image,
  Stack,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  MenuDivider,
  Heading,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import LOGO from "../assets/logo.png";

export default function HeadBar() {
  const navigate = useNavigate();

  const HandleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };


  return (
    <Flex backgroundColor="blue.800" alignItems="center" direction="row" pt={2} pb={2} pr={4} pl={4} justifyContent='space-between'>
      <Image width="10%" height="auto" src={LOGO} />
      <Menu>
        <MenuButton as={Avatar} src={localStorage.getItem("useravatar")} />
        <MenuList>
          <Stack p={4} justifyContent="center" alignItems="center">
            <Avatar size='xl' src={localStorage.getItem("useravatar")} />
            <Heading size="md">{localStorage.getItem("userfullname")}</Heading>
            <Text>{localStorage.getItem("usertype").charAt(0).toUpperCase() + localStorage.getItem("usertype").slice(1)}</Text>
            <Text>{localStorage.getItem("usersubject").charAt(0).toUpperCase() + localStorage.getItem("usersubject").slice(1)}</Text>
          </Stack>
          <MenuDivider />
          <MenuItem onClick={HandleLogout}>Logout</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
}
