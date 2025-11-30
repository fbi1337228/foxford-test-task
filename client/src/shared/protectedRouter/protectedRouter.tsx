import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Spin } from "antd";

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo: string;
}

export default function ProtectedRoute({
  children,
  redirectTo,
}: ProtectedRouteProps) {
  const { isAuth, isLoading } = useAuth();

  if (isLoading) return <Spin />;
  if (!isAuth) return <Navigate to={redirectTo} replace />;
  return <>{children}</>;
}
