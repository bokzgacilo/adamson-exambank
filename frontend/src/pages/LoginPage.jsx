import {
  Button,
  Card,
  CardBody,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Text,
  Stack,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Center,
} from "@chakra-ui/react";
import LOGO from "../assets/logo.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TbLogin2 } from "react-icons/tb";
import { Formik, Form, Field } from "formik";
import useUserStore from "../helper/useUserStore";
import useAuthStore from "../helper/useAuthStore";
import { useEffect, useState } from "react";
import BGIMAGE from "../assets/bg-2.jpg";

const userHasValues = (user) => {
  return Object.values(user).some(value =>
    Array.isArray(value) ? value.length > 0 : value
  );
};

export default function LoginPage() {
  const { user } = useUserStore();
  const setUserId = useAuthStore((state) => state.setUserId);
  const navigate = useNavigate();
  const toast = useToast();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userid") || null;

    if (userHasValues(user) && userId) {
      navigate("/dashboard");
    } else {
      setCheckingAuth(false);
    }
  }, [])

  if (checkingAuth) {
    return null;
  }

  const handleResetPassword = async () => {
    setIsLoading(true)
    
    await axios.post("http://localhost/exam-bank/api/ServicesRoute.php?action=reset_password", {
      email: email,
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

        setIsLoading(false)
        setEmail("")
      })
  }

  return (
    <Container
      maxW="100vw"
      h="100vh"
      pt="10dvh"
      backgroundImage={`url(${BGIMAGE})`}
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
      backgroundPosition="center"
    >

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Forgot Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>
              <Text>Email</Text>
              <Input value={email} onChange={(e) => setEmail(e.currentTarget.value)} size="sm" type="email" placeholder="Email" />
              <Text fontSize="12px">This will generate a new password that will sent to your email.</Text>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button size="sm" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button isLoading={isLoading}
              loadingText="Resetting..." onClick={handleResetPassword} size="sm" colorScheme="blue">Reset Password</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Center>
        <Card alignSelf="center" w={{ base: "100%", md: "75%", lg: "30%" }}>
          <CardBody>
            <Stack p={4}>
              <Image w="35%" src={LOGO} mt={4} alignSelf="center" />
              <Heading size="md" mb={4} textAlign="center">EXAM BANK</Heading>
              <Formik
                initialValues={{ username: "", password: "" }}
                onSubmit={(values, actions) => {
                  const emailPattern = /^[a-zA-Z0-9._%+-]+@adamson\.edu\.ph$/;

                  if (!emailPattern.test(values.username)) {
                    toast({
                      title: "Invalid Email",
                      description: "Please use your Adamson associated email to login (e.g. john@adamson.edu.ph).",
                      status: "warning",
                      duration: 4000,
                      isClosable: true,
                    });

                    actions.setSubmitting(false);
                    return; // stop login if invalid
                  }

                  axios
                    .post(
                      "http://localhost/exam-bank/api/UserRoute.php?action=login",
                      values
                    )
                    .then((response) => {
                      if (response.data.user.id !== undefined) {
                        setUserId(response.data.user.id);

                        const userData = {
                          id: response.data.user.id,
                          fullname: response.data.user.name,
                          email: response.data.user.email,
                          password: response.data.user.password,
                          avatar: "http://localhost/exam-bank/api/" + response.data.user.avatar,
                          usertype: response.data.user.type,
                          user_assigned_subject:
                            response.data.user.assigned_subject || [],
                          user_assigned_department:
                            response.data.user.assigned_department || [],
                        };

                        useUserStore.getState().setUser(userData)

                        toast({
                          title: "Login Successfully",
                          description: "Welcome back " + userData.fullname,
                          status: "success",
                          duration: 5000,
                          isClosable: true,
                        });

                        navigate("/dashboard");
                      } else {
                        toast({
                          title: "Login Failed",
                          description: response.data.message,
                          status: "error",
                          duration: 3000,
                          isClosable: true,
                        });
                      }
                    })
                    .catch((error) => {
                      console.error("Login Error:", error);
                      toast({
                        title: "Login Failed",
                        description: "Something went wrong. Please try again.",
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                      });
                    });

                  actions.setSubmitting(false);
                }}
              >
                {({ handleSubmit }) => (
                  <Form onSubmit={handleSubmit}>
                    <FormControl isRequired>
                      <FormLabel fontWeight="semibold">Email</FormLabel>
                      <Field
                        as={Input}
                        name="username"
                        type="email"
                        placeholder="juandelacruz@adamson.edu.ph"
                        required
                      />
                    </FormControl>
                    <FormControl isRequired mt={4}>
                      <FormLabel fontWeight="semibold">Password</FormLabel>
                      <Field
                        as={Input}
                        name="password"
                        type="password"
                        placeholder="Password"
                        required
                      />
                    </FormControl>
                    <Text fontSize="14px" fontWeight="semibold" cursor="pointer" mt={1} textAlign="right" onClick={onOpen} >Forgot Password?</Text>
                    <Button
                      type="submit"
                      leftIcon={<TbLogin2 />}
                      w="100%"
                      mt={4}
                      colorScheme="blue"
                    >
                      Login
                    </Button>
                  </Form>
                )}
              </Formik>
            </Stack>
          </CardBody>
        </Card>
      </Center>
    </Container>
  );
}
