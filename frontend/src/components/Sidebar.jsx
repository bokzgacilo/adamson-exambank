import {
  Button, Flex, Heading, Icon, Text, Card, CardBody, Avatar, useDisclosure,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody,
  ModalCloseButton, Image, Stack, Input, useToast,
  Divider,
  FormControl,
  FormLabel
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LOGO from "../assets/logo.png";
import { TbChartDots, TbCheck, TbFileDescription, TbHistory, TbKey, TbList, TbLogout, TbLogout2, TbQuestionMark, TbUsers } from "react-icons/tb";
import axios from "axios";
import useUserStore from "../helper/useUserStore";
import useAuthStore from "../helper/useAuthStore";

export default function SidebarComponent() {
  const { isOpen: isOpenPasswordModal, onOpen: onOpenPasswordModal, onClose: onClosePasswordModal } = useDisclosure();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenProfileModal, onOpen: onOpenProfileModal, onClose: onCloseProfileModal } = useDisclosure();

  const { user, setUser, clearUser } = useUserStore();
  const assignedSubjects = JSON.parse(user.user_assigned_subject)
  const assignedDepartments = JSON.parse(user.user_assigned_department)
  const [UserData, SetUserData] = useState({});
  const [Preview, SetPreview] = useState("");
  const [ImageFile, SetImageFile] = useState(null);
  const [Password, SetPassword] = useState("");
  const [newPassword, setNewPassword] = useState("")
  const [oldPassword, setOldPassword] = useState("")
  const [retypePassword, setRetypePassword] = useState("")

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const toast = useToast();
  const location = useLocation();

  const navigationItems = [
    { to: "questions", label: "Exam Question Bank", pathname: "/dashboard/questions", icon: TbQuestionMark },
    { to: "quiz_questions", label: "Quiz Question Bank", pathname: "/dashboard/quiz_questions", icon: TbQuestionMark },
    { to: "quiz", label: "Quiz Bank", pathname: "/dashboard/quiz", icon: TbFileDescription },
    { to: "exams", label: "Exam Bank", pathname: "/dashboard/exams", icon: TbFileDescription },
    ...(UserData.type === "Admin"
      ? [
        { to: "users", label: "Manage Users", pathname: "/dashboard/users", icon: TbUsers },
        { to: "department", label: "Manage Departments", pathname: "/dashboard/department", icon: TbUsers },
        { to: "subjects", label: "Manage Subjects", pathname: "/dashboard/subjects", icon: TbList },
        { to: "statistics", label: "Dashboard", pathname: "/dashboard/statistics", icon: TbChartDots },
        { to: "history", label: "Logs History", pathname: "/dashboard/history", icon: TbHistory }
      ]
      : [])
  ];

  useEffect(() => {
    const FetchUserData = async () => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_HOST}UserRoute.php?action=get_user_data`, {
          id: user.id
        });
        SetUserData(response.data);
        SetPassword(response.data.password);
        SetPreview(`${import.meta.env.VITE_API_HOST}${response.data.avatar}`);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };
    FetchUserData();
  }, [user]);

  const HandleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_HOST}UserRoute.php?action=logout`,
        { fullname: user.fullname } // Replace with actual value you want to send
      );

      clearUser();
      localStorage.clear();
      SetUserData({});
      useAuthStore.getState().logout();

      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const HandleChangeAvatar = () => fileInputRef.current.click();

  const HandleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        SetPreview(reader.result);
        SetImageFile(file);
        HandleSaveAvatar(file)
      };
      reader.readAsDataURL(file);

    }
  };

  const HandleSaveAvatar = async (file) => {
    const formData = new FormData();
    formData.append("avatar", file);
    formData.append("id", user.id);
    formData.append("fullname", user.fullname);
    formData.append("usertype", user.usertype);
    formData.append("department", JSON.parse(user.user_assigned_department)[0]);
    await axios.post(`${import.meta.env.VITE_API_HOST}UserRoute.php?action=change_avatar`, formData, { headers: { "Content-Type": "multipart/form-data" } })
  }

  const HandleSaveChanges = async () => {
    if (!/^\S{8,}$/.test(newPassword)) {
      toast({ title: "Invalid Password", description: "Password must be at least 8 characters with no spaces.", status: "error", duration: 3000, isClosable: true });
      return;
    }

    if (oldPassword !== Password && oldPassword !== retypePassword) {
      toast({ title: "Incorrect Old Password", description: "Old and Retype password must be matched with your old passwords.", status: "error", duration: 3000, isClosable: true });
      return;
    }

    const formData = new FormData();
    formData.append("password", newPassword);
    formData.append("id", user.id);

    try {
      await axios.post(`${import.meta.env.VITE_API_HOST}UserRoute.php?action=change_password`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      toast({ title: "Profile Updated", status: "success", duration: 3000, isClosable: true });
      setUser({ ...user, password: newPassword });
      onCloseProfileModal();
      onClosePasswordModal();
      SetPassword(newPassword);
      setNewPassword("")
      setOldPassword("")
      setRetypePassword("")
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  return (
    <Flex direction="column" gap={4} p={4} backgroundColor="#2b2b2b" color="#fff">
      <Modal isOpen={isOpenPasswordModal} onClose={onClosePasswordModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading size="lg">Change Password</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          </ModalBody>
          <Stack px={4}>
            <FormControl isRequired>
              <FormLabel>New Password</FormLabel>
              <Input value={newPassword} onChange={e => setNewPassword(e.currentTarget.value)} type="password" placeholder="New Password" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Old Password</FormLabel>
              <Input value={oldPassword} onChange={e => setOldPassword(e.currentTarget.value)} type="password" placeholder="New Password" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Re-type Old Password</FormLabel>
              <Input value={retypePassword} onChange={e => setRetypePassword(e.currentTarget.value)} type="password" placeholder="New Password" />
            </FormControl>
            <Text noOfLines={2} fontSize="14px" fontWeight="semibold">If you forgot your old password, please contact administrator to request new password.</Text>
          </Stack>
          <ModalFooter>

            <Button mr={4} onClick={onClosePasswordModal}>Close</Button>
            <Button rightIcon={<TbCheck />} colorScheme='green' onClick={HandleSaveChanges}>
              Update Password
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpenProfileModal} onClose={onCloseProfileModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading size="lg">Account</Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>
              <Avatar onClick={HandleChangeAvatar} cursor="pointer" alignSelf="center" size="2xl" src={Preview} mb={4} />
              <Input type="file" accept=".jpg, .webp, .jpeg" ref={fileInputRef} hidden onChange={HandleFileChange} />
              <Text fontWeight="semibold">Username</Text>
              <Input value={UserData.username || ""} isDisabled />
              <Divider />
              <Text fontWeight="semibold">Assigned Subject</Text>
              {assignedSubjects.length > 0 ? (
                assignedSubjects.map((subject, index) => (
                  <Text key={index} mb={2}>
                    {index + 1}. {subject}
                  </Text>
                ))
              ) : (
                <Text>No assigned subjects</Text>
              )}
              <Divider />
              <Text fontWeight="semibold">Assigned Department</Text>
              {assignedDepartments.length > 0 ? (
                assignedDepartments.map((department, index) => (
                  <Text key={index} mb={2}>
                    {index + 1}. {department}
                  </Text>
                ))
              ) : (
                <Text>No assigned departments</Text>
              )}
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onCloseProfileModal} mr={2}>Close</Button>
            <Button rightIcon={<TbKey />} colorScheme="green" onClick={onOpenPasswordModal}>Change Password</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>Log Out</ModalHeader>
            <ModalBody>
              <Text textAlign="center" fontWeight="semibold">Are you sure you want to log out?</Text>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose} mr={2}>Cancel</Button>
              <Button rightIcon={<TbLogout />} colorScheme="red" onClick={HandleLogout}>Logout</Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>

      <Image alignSelf="center" mt={4} w="30%" src={LOGO} />
      <Heading textAlign="center" size="lg">Exam Bank  Dashboard</Heading>

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
      <Divider />
      <Heading size="lg" mt={2}>Menu</Heading>
      <Stack spacing={0}>
        {navigationItems.map(({ to, label, pathname, icon }, index) => (
          <Flex
            as={Link}
            to={to}
            key={index}
            fontSize="16px"
            alignItems="center"
            p={3}
            borderRadius={2}
            color={location.pathname === pathname ? "#eff024" : "lightgray"}
            backgroundColor={location.pathname === pathname ? "#b0b0b021" : ""}
            gap={4}
            _hover={{
              backgroundColor: "#b0b0b021", // or any hover bg color
              cursor: "pointer", // optional, gives visual feedback
            }}
          >
            <Icon as={icon} />
            <Text fontWeight="semibold">{label}</Text>
          </Flex>
        ))}
        <Flex gap={4} p={3} cursor="pointer" fontSize="16px" alignItems="center" mt="auto" onClick={onOpen}>
          <Icon as={TbLogout2} />
          <Text fontWeight="semibold">Log Out</Text>
        </Flex>
      </Stack>
    </Flex>
  );
}