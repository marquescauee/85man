import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // Verifica se está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>; // Renderiza os filhos
};

export default ProtectedRoute;
