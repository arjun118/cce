import React from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
const RequireAuth = () => {
  const { auth } = useAuth();
  const location = useLocation();
  return auth?.token ? (
    <Outlet />
  ) : (
    <Navigate to="/auth/login" state={{ from: location }} replace={true} />
  );
};

export default RequireAuth;
