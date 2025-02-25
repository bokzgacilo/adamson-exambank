import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "./useAuthStore";

const AuthGuard = ({ children }) => {
  const { userId } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate("/login"); // Redirect if not logged in
    }
  }, [userId, navigate]);

  return children;
};

export default AuthGuard;
