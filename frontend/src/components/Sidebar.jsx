import {
  Button, Flex, Heading, Icon, Text, Card, CardBody, Avatar, useDisclosure,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody,
  ModalCloseButton, Image, Stack, Input, useToast
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LOGO from "../assets/logo.png";
import { TbChartDots, TbFileDescription, TbList, TbLogout2, TbQuestionMark, TbUsers } from "react-icons/tb";
import axios from "axios";
import useUserStore from "../helper/useUserStore";
import useAuthStore from "../helper/useAuthStore";

export default function SidebarComponent() {
  const { user, setUser, clearUser } = useUserStore();
  const [UserData, SetUserData] = useState({});
  const [Preview, SetPreview] = useState("");
  const [ImageFile, SetImageFile] = useState(null);
  const [Password, SetPassword] = useState("");
  
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const toast = useToast();
  const location = useLocation();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenProfileModal, onOpen: onOpenProfileModal, onClose: onCloseProfileModal } = useDisclosure();

  const navigationItems = [
    { to: "questions", label: "Question Bank", pathname: "/dashboard/questions", icon: TbQuestionMark },
    { to: "exams", label: "Exam Bank", pathname: "/dashboard/exams", icon: TbFileDescription },
    ...(UserData.type === "Admin"
      ? [
          { to: "users", label: "User Management", pathname: "/dashboard/users", icon: TbUsers },
          { to: "subjects", label: "Subjects", pathname: "/dashboard/subjects", icon: TbList },
          { to: "statistics", label: "Dashboard", pathname: "/dashboard/statistics", icon: TbChartDots }
        ]
      : [])
  ];

  useEffect(() => {
    const FetchUserData = async () => {
      try {
        const response = await axios.post("http://localhost/exam-bank/api/UserRoute.php?action=get_user_data", {
          id: user.id
        });
        SetUserData(response.data);
        SetPassword(response.data.password);
        SetPreview(`http://localhost/exam-bank/api/${response.data.avatar}`);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };
    FetchUserData();
  }, [user]);

  const HandleLogout = () => {
    clearUser();
    localStorage.clear();
    SetUserData({});
    useAuthStore.getState().logout();
    navigate("/login");
  };

  const HandleChangeAvatar = () => fileInputRef.current.click();

  const HandleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        SetPreview(reader.result);
        SetImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const HandleSaveChanges = async () => {
    if (!/^\S{8,}$/.test(Password)) {
      toast({ title: "Invalid Password", description: "Password must be at least 8 characters with no spaces.", status: "error", duration: 3000, isClosable: true });
      return;
    }

    const formData = new FormData();
    formData.append("password", Password);
    formData.append("id", user.id);
    if (ImageFile) formData.append("avatar", ImageFile);

    try {
      await axios.post("http://localhost/exam-bank/api/UserRoute.php?action=change_avatar", formData, { headers: { "Content-Type": "multipart/form-data" } });
      toast({ title: "Profile Updated", status: "success", duration: 3000, isClosable: true });
      setUser({ ...user, password: Password });
      onCloseProfileModal();
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  return (
    <Flex direction="column" gap={4} p={4} backgroundColor="#2b2b2b" color="#fff">
      <Modal isOpen={isOpenProfileModal} onClose={onCloseProfileModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>USER PROFILE</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack p={4}>
              <Avatar onClick={HandleChangeAvatar} cursor="pointer" alignSelf="center" size="2xl" src={Preview} mb={4} />
              <Input type="file" accept=".jpg, .webp, .jpeg" ref={fileInputRef} hidden onChange={HandleFileChange} />
              <Text fontWeight="semibold">USERNAME</Text>
              <Input size="sm" value={UserData.username || ""} isDisabled />
              <Text fontWeight="semibold" mt={4}>PASSWORD</Text>
              <Input size="sm" value={Password} onChange={(e) => SetPassword(e.currentTarget.value)} />
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button size="sm" onClick={onCloseProfileModal} mr={2}>Close</Button>
            <Button size="sm" colorScheme="green" onClick={HandleSaveChanges}>Save Changes</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay>
          <ModalContent>
            <ModalCloseButton />
            <ModalHeader>LOGOUT</ModalHeader>
            <ModalBody><Text textAlign="center">Are you sure you want to log out?</Text></ModalBody>
            <ModalFooter>
              <Button size="sm" onClick={onClose} mr={2}>Cancel</Button>
              <Button size="sm" colorScheme="red" onClick={HandleLogout}>Logout</Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>

      <Image alignSelf="center" mt={4} w="30%" src={LOGO} />
      <Heading textAlign="center" mb={4}>Exam Bank</Heading>

      {UserData.username ? (
        <Card backgroundColor="#b0b0b021" onClick={onOpenProfileModal} cursor="pointer">
          <CardBody>
            <Flex alignItems="center" gap={4}>
              <Avatar src={Preview} />
              <Flex color="#fff" direction="column">
                <Heading size="md">{UserData.name}</Heading>
                <Text fontWeight="semibold">{UserData.type}</Text>
              </Flex>
            </Flex>
          </CardBody>
        </Card>
      ) : <Text>Error Fetching User Data...</Text>}

      <Heading size="md" mt={2}>MENU</Heading>
      <Stack spacing={0}>
        {navigationItems.map(({ to, label, pathname, icon }) => (
          <Flex
            as={Link}
            to={to}
            key={to}
            fontSize="18px"
            alignItems="center"
            p={4}
            borderRadius={2}
            color={location.pathname === pathname ? "#eff024" : "lightgray"}
            backgroundColor={location.pathname === pathname ? "#b0b0b021" : ""}
            gap={4}
          >
            <Icon as={icon} />
            <Text fontWeight="semibold">{label}</Text>
          </Flex>
        ))}
      </Stack>
      

      <Flex p={4} cursor="pointer" fontSize="16px" alignItems="center" gap={2} mt="auto" justifyContent="center" onClick={onOpen}>
        <Icon as={TbLogout2} />
        <Text fontWeight="semibold">LOG OUT</Text>
      </Flex>
    </Flex>
  );
}