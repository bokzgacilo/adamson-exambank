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
                        username: response.data.user.username,
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
                    <FormLabel fontWeight="semibold">USERNAME</FormLabel>
                    <Field
                      as={Input}
                      name="username"
                      type="text"
                      placeholder="juandelacruz"
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
