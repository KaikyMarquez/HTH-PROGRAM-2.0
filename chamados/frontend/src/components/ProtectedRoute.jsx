// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';

// Este componente recebe outro componente como "filho" (children)
function ProtectedRoute({ children }) {
  // Verifica se o token de autenticação existe no localStorage
  const token = localStorage.getItem('authToken');

  if (!token) {
    // Se não houver token, redireciona o usuário para a página de login
    return <Navigate to="/login" />;
  }

  // Se houver um token, renderiza o componente filho (a página protegida)
  return children;
}

export default ProtectedRoute;