import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";

const Logout = () => {
  const { signOut } = useClerk();
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      await signOut(); // Clerk's built-in logout
      localStorage.clear(); // Optional, not generally needed
      navigate("/"); // Redirect to home
    };
    logout();
  }, []);

  return null;
};

export default Logout;
