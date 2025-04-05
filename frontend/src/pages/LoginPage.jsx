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
} from "@chakra-ui/react";
import LOGO from "../assets/logo.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TbLogin2 } from "react-icons/tb";
import { Formik, Form, Field } from "formik";
import useUserStore from "../helper/useUserStore";
import useAuthStore from "../helper/useAuthStore";
import { useEffect, useState } from "react";

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
    <Container maxW="400px">
      <Card mt={16}>
        <CardBody>
          <Stack p={4}>
            <Image w="50%" src={LOGO} mt={4} mb={8} alignSelf="center" />
            <Heading mb={4}>Exam Bank</Heading>
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
                    <FormLabel fontWeight="semibold">EMAIL</FormLabel>
                    <Field
                      as={Input}
                      name="username"
                      type="email"
                      placeholder="juandelacruz@adamson.edu.ph"
                      required
                    />
                  </FormControl>
                  <FormControl isRequired mt={4}>
                    <FormLabel fontWeight="semibold">PASSWORD</FormLabel>
                    <Field
                      as={Input}
                      name="password"
                      type="password"
                      required
                    />
                  </FormControl>
                  <Button
                    type="submit"
                    rightIcon={<TbLogin2 />}
                    w="100%"
                    mt={4}
                    colorScheme="blue"
                    size="lg"
                  >
                    Login
                  </Button>
                </Form>
              )}
            </Formik>
          </Stack>
        </CardBody>
      </Card>
    </Container>
  );
}
