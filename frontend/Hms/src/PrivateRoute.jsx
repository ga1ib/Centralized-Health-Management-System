// PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  // If token exists, show the protected component, else redirect to login.
  return token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
