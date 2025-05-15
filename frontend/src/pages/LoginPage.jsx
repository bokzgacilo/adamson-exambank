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
  Stack,
  useToast,
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
      <Center>
        <Card alignSelf="center" w={{ base: "100%", md: "75%", lg: "25%" }}>
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
                      `${import.meta.env.VITE_API_HOST}UserRoute.php?action=login`,
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
                          avatar: import.meta.env.VITE_API_HOST + response.data.user.avatar,
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
                    <Button
                      type="submit"
                      leftIcon={<TbLogin2 />}
                      width="100%"
                      size="lg"
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
