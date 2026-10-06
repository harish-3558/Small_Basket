import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const RequireRole = ({ role }) => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const currentRole = useAuthStore((state) => state.role);
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (currentRole !== role) return <Navigate to="/" replace />;
  return <Outlet />;
};

export default RequireRole;
