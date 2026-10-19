import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage, RegisterPage, DashboardPage, ShowcasePage } from '../pages';
import { ProtectedRoute, PublicRoute } from '../components/auth';
import { AppLayout } from '../layouts/AppLayout';

export const router = createBrowserRouter([
  // Rotas públicas (acessíveis apenas por usuários não autenticados)
  {
    path: '/login',
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <PublicRoute>
        <RegisterPage />
      </PublicRoute>
    ),
  },

  // Rotas protegidas (exigem autenticação ativa e renderizam sob AppLayout)
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'showcase',
        element: <ShowcasePage />,
      },
    ],
  },

  // Fallback de rota inexistente
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
