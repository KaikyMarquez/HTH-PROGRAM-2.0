// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('authToken');
  const userString = localStorage.getItem('user');
  let user = null;

  try {
    // Garante que o 'user' só seja parseado se existir e for um JSON válido
    user = userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error("Falha ao parsear dados do usuário do localStorage", error);
    // Se os dados do usuário estiverem corrompidos, trata como não autenticado
    return <Navigate to="/login" replace />;
  }

  if (!token || !user) {
    // Se não houver token ou dados do usuário, redireciona para a página de login
    return <Navigate to="/login" replace />;
  }

  // Se a rota exige roles específicas e o usuário não tem uma delas, redireciona.
  if (allowedRoles && (!user?.role || !allowedRoles.includes(user.role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Se houver um token, renderiza o componente filho (a página protegida)
  return children;
}

export default ProtectedRoute;