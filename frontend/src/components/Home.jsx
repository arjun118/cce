import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, VStack } from "@chakra-ui/react";
import useLogout from "../hooks/useLogout";
const Home = () => {
  const navigate = useNavigate();
  const logout = useLogout();

  const signOut = async () => {
    await logout();
    navigate("/auth/login");
  };
  return (
    <div>
      <VStack>
        <Link to="/auth/login">Login</Link>

        <Link to="/auth/signup">singup</Link>

        <Link to="/users">users</Link>
        <Button onClick={signOut}>Logout</Button>
      </VStack>
    </div>
  );
};

export default Home;
