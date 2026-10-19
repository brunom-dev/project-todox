import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores';

interface RouteGuardProps {
  children: React.ReactNode;
}

/**
 * Guarda de rota privada: Bloqueia acesso não autenticado e preserva a intenção de rota original
 */
export const ProtectedRoute: React.FC<RouteGuardProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

/**
 * Guarda de rota pública: Impede que usuários já autenticados acessem /login ou /register
 */
export const PublicRoute: React.FC<RouteGuardProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (isAuthenticated) {
    const destination = (location.state as { from?: Location })?.from?.pathname || '/';
    return <Navigate to={destination} replace />;
  }

  return <>{children}</>;
};
