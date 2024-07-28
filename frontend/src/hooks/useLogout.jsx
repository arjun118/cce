import axios from "../api/axios";
import useAuth from "./useAuth";

import React from "react";

const useLogout = () => {
  const { setAuth } = useAuth();

  const logout = async () => {
    setAuth({});
    try {
      const response = await axios("/auth/logout", {
        withCredentials: true,
      });
    } catch (err) {
      //need to do something about this
      console.log(err);
    }
  };

  return logout;
};

export default useLogout;
