import { BrowserRouter as Router, Outlet, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import QuestionPage from "./pages/QuestionPage";
import ExamPage from "./pages/ExamPage";
import "primereact/resources/themes/tailwind-light/theme.css";
import "primereact/resources/primereact.min.css";
import UserPage from "./pages/UsersPage";
import AuthGuard from "./helper/AuthGuard";
import SubjectPage from "./pages/SubjectPage";
import StatisticsPage from "./pages/StatisticsPage";
import { Container, SimpleGrid, Stack, useToast } from "@chakra-ui/react";
import SidebarComponent from "./components/Sidebar";
import useUserStore from "./helper/useUserStore";
import { useEffect, useRef } from "react";
import { database } from "./helper/Firebase";
import { onChildAdded, ref } from "firebase/database";
import DepartmentPage from "./pages/DepartmentPage";
import QuizPage from "./pages/QuizPage";

import 'primereact/resources/themes/lara-light-blue/theme.css'; // or any theme
import 'primereact/resources/primereact.min.css';

function DashboardLayout() {
  return (
    <AuthGuard>
      <Stack height="100vh" spacing={0}>
        <SimpleGrid templateColumns="18% 82%" flex={1}>
          <SidebarComponent />
          <Container p={0} maxW="none" w="100%" backgroundColor="#e2e2e2">
            <Outlet />
          </Container>
        </SimpleGrid>
      </Stack>
    </AuthGuard>
  );
}

export default function App() {
  const { user } = useUserStore();
  const mountTime = useRef(Date.now());
  const toast = useToast();

  useEffect(() => {
    if (user.usertype !== "Admin") return;

    const logsRef = ref(database, "/logs");

    const unsubscribe = onChildAdded(logsRef, (snapshot) => {
      const newLog = snapshot.val();

      if (newLog.timestamp && newLog.timestamp >= mountTime.current) {
        toast({
          title: newLog.action,
          description: `${newLog.target} by ${newLog.actor}`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/" element={<LoginPage />}></Route>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<QuestionPage />} />
          <Route path="questions" element={<QuestionPage />} />
          <Route path="exams" element={<ExamPage />} />
          <Route path="users" element={<UserPage />} />
          <Route path="subjects" element={<SubjectPage />} />
          <Route path="statistics" element={<StatisticsPage />} />
          <Route path="department" element={<DepartmentPage />} />
          <Route path="quiz" element={<QuizPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
