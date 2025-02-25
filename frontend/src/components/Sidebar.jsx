import {
  Button,
  Flex,
  Heading,
  Icon,
  Text,
  Card,
  CardBody,
  Avatar,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogHeader,
  useDisclosure,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogContent,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Image,
  Stack,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LOGO from "../assets/logo.png";
import {
  TbChartDots,
  TbFileDescription,
  TbList,
  TbLogout2,
  TbQuestionMark,
  TbUsers,
} from "react-icons/tb";
import axios from "axios";
import useUserStore from "../helper/useUserStore";
import useAuthStore from "../helper/useAuthStore";

export default function SidebarComponent() {
  const { user, setUser, clearUser } = useUserStore();
  const logout = useAuthStore((state) => state.logout);
  const location = useLocation();
  const Usertype = user.usertype;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenProfileModal,
    onOpen: onOpenProfileModal,
    onClose: onCloseProfileModal,
  } = useDisclosure();
  const cancelRef = useRef();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [Preview, setPreview] = useState(user.avatar);
  const [ImageFile, SetImageFile] = useState(null);
  const toast = useToast();
  const [Password, SetPassword] = useState(user.password);

  const navigationItems = (() => {
    switch (user.usertype) {
      case "Instructor":
        return [
          {
            to: "questions",
            label: "Question Bank",
            pathname: "/dashboard/questions",
            icon: TbQuestionMark,
          },
          {
            to: "exams",
            label: "Exam Bank",
            pathname: "/dashboard/exams",
            icon: TbFileDescription,
          },
        ];
      case "Admin":
        return [
          {
            to: "questions",
            label: "Question Bank",
            pathname: "/dashboard/questions",
            icon: TbQuestionMark,
          },
          {
            to: "exams",
            label: "Exam Bank",
            pathname: "/dashboard/exams",
            icon: TbFileDescription,
          },
          {
            to: "users",
            label: "User Management",
            pathname: "/dashboard/users",
            icon: TbUsers,
          },
          {
            to: "subjects",
            label: "Subjects",
            pathname: "/dashboard/subjects",
            icon: TbList,
          },
          {
            to: "statistics",
            label: "Statistics",
            pathname: "/dashboard/statistics",
            icon: TbChartDots,
          },
        ];
      case "Coordinator":
        return [
          {
            to: "questions",
            label: "Question Bank",
            pathname: "/dashboard/questions",
            icon: TbQuestionMark,
          },
          {
            to: "exams",
            label: "Exam Bank",
            pathname: "/dashboard/exams",
            icon: TbFileDescription,
          },
        ];
      default:
        return [];
    }
  })();

  const HandleLogout = () => {
    localStorage.clear();
    clearUser()
    logout();
    navigate("/login");
  };

  const HandleChangeAvatar = () => {
    fileInputRef.current.click();
  };

  const HandleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        SetImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const HandleSaveChanges = () => {

    const passwordRegex = /^\S{8,}$/;

    if (!passwordRegex.test(Password)) {
      toast({
        title: "Invalid Password",
        description:
          "Password must be at least 8 characters long and contain no spaces.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const file = fileInputRef.current.files[0];

    const formData = new FormData();
    formData.append("password", Password);
    formData.append("id", user.id);

    if (file) {
      formData.append("avatar", ImageFile);
    }

    axios
      .post(
        "http://localhost/exam-bank/api/UserRoute.php?action=change_avatar",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      )
      .then((response) => {
        toast({
          title: "Profile Updated",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        const updatedUser = {
          ...user,
          password: Password
        };
  
        setUser(updatedUser);

        onCloseProfileModal()
      })
      .catch((error) => {
        console.error("Error uploading image", error);
      });
  };

  return (
    <Flex
      direction="column"
      gap={4}
      p={4}
      backgroundColor="#2b2b2b"
      color="#fff"
    >
      <Modal isOpen={isOpenProfileModal} onClose={onCloseProfileModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{user.fullname}</ModalHeader>
          <ModalCloseButton />
          <ModalBody></ModalBody>
          <Stack p={4}>
            <Avatar
              onClick={HandleChangeAvatar}
              cursor="pointer"
              alignSelf="center"
              size="2xl"
              src={Preview}
              mb={4}
            />
            <Input
              type="file"
              accept=".jpg, .png"
              ref={fileInputRef}
              hidden
              onChange={HandleFileChange}
            />
            <Heading size="md">Username</Heading>
            <Input value={user.username} isReadOnly />
            <Heading size="md" mt={2}>
              Password
            </Heading>
            <Input
              value={Password}
              onChange={(e) => SetPassword(e.currentTarget.value)}
            />
          </Stack>
          <ModalFooter>
            <Button colorScheme="green" mr={2} onClick={HandleSaveChanges}>
              Save Changes
            </Button>
            <Button onClick={onCloseProfileModal}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Logout</AlertDialogHeader>
            <AlertDialogBody>Are you sure you want to log out?</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose} mr={4}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={HandleLogout}>
                Logout
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <Image alignSelf="center" mt={4} w={"30%"} src={LOGO} />
      <Heading textAlign="center" mb={4}>
        Exam Bank
      </Heading>
      <Card
        backgroundColor="#b0b0b021"
        onClick={onOpenProfileModal}
        cursor="pointer"
      >
        <CardBody>
          <Flex direction="row" alignItems="center" color="#fff" gap={4}>
            <Avatar src={Preview} />
            <Flex direction="column">
              <Heading size="md">
                {user.fullname}
              </Heading>
              <Text>{user.usertype}</Text>
            </Flex>
          </Flex>
        </CardBody>
      </Card>
      <Heading size="lg" mt={4}>
        Menu
      </Heading>
      {navigationItems.map((item) => {
        if (
          Usertype !== "admin" &&
          item.to === "users" &&
          item.to === "subjects"
        ) {
          return null;
        }

        return (
          <Flex
            direction="row"
            fontSize="18px"
            gap={4}
            alignItems="center"
            key={item.to}
            as={Link}
            to={item.to}
            padding={4}
            borderRadius={2}
            color={
              location.pathname === item.pathname ? "#eff024" : "lightgray"
            }
            backgroundColor={
              location.pathname === item.pathname ? "#b0b0b021" : ""
            }
          >
            <Icon as={item.icon} />
            <Text>{item.label}</Text>
          </Flex>
        );
      })}
      <Flex
        p={4}
        cursor="pointer"
        color="lightgray"
        fontSize="16px"
        alignItems="center"
        gap={2}
        mt="auto"
        direction="row"
        justifyContent="center"
        onClick={onOpen}
      >
        <Icon as={TbLogout2} />
        <Text>Log Out</Text>
      </Flex>
    </Flex>
  );
}
