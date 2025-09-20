import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";

export default function ProtectedRoute({ allowedRoles = [] }) {
  const { isAuthenticated, user } = useContext(AuthContext);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (
    allowedRoles.length > 0 &&
    (!user || !allowedRoles.includes(user.user_type))
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
