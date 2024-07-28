import axios from "../api/axios";
import useAuth from "./useAuth";

import React from "react";

const useRefreshToken = () => {
  const { setAuth } = useAuth();
  const refresh = async () => {
    const response = await axios.get("/auth/refresh", {
      withCredentials: true,
    });
    console.log("new access token :", response.data.token);
    setAuth((prev) => {
      return { ...prev, token: response.data.token };
    });
    return response.data.token;
  };
  return refresh;
};

export default useRefreshToken;
