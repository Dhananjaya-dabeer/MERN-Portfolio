import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function PrivateRoute() {
  const { isAuthenticated } = useSelector((state) => state.user);

  return isAuthenticated ? <Outlet /> : <Navigate to={"/login"} />;
}

export default PrivateRoute;
