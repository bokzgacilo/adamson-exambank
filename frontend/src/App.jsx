import {Route, Routes} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './Dashboard';
import QuestionPage from './pages/QuestionPage';
import ExamPage from './pages/ExamPage';
import "primereact/resources/themes/tailwind-light/theme.css"; 
import "primereact/resources/primereact.min.css"; 
import UserPage from './pages/UsersPage';
import AuthGuard from './helper/AuthGuard';
import SubjectPage from './pages/SubjectPage';
import StatisticsPage from './pages/StatisticsPage';
import { useEffect, useRef, useState } from "react";
import { getDatabase, limitToLast, onChildAdded, onValue, orderByChild, orderByKey, query, ref } from "firebase/database";
import app from "./helper/Firebase";
import axios from "axios";
import useUserStore from "./helper/useUserStore";
import { useToast } from '@chakra-ui/react';

export default function App() {
  const {user} = useUserStore();
  const toast = useToast();
  const firebaseDB = getDatabase(app)
  const [Questions, SetQuestions] = useState([])

  


  return (
    <Routes>
      <Route path='/login' element={<LoginPage />}></Route>
      <Route path='/' element={<LoginPage />}></Route>
      <Route path='/dashboard' element={<AuthGuard><Dashboard /></AuthGuard>}>
        <Route index element={<QuestionPage />} />
        <Route path="questions" element={<QuestionPage />} />
        <Route path="exams" element={<ExamPage />} />
        <Route path="users" element={<UserPage />} />
        <Route path="subjects" element={<SubjectPage />} />
        <Route path="statistics" element={<StatisticsPage />} />
      </Route>
    </Routes>
  )
}