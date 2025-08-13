// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import TVPage from './components/TVPage';
import RegisterUserPage from './components/RegisterUserPage';
import CreateTicketPage from './components/CreateTicketPage';
import UnauthorizedPage from './components/UnauthorizedPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Rotas Protegidas */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'TECNICO', 'VISUALIZADOR']}>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tv" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'TECNICO', 'VISUALIZADOR']}>
              <TVPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/register-user" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <RegisterUserPage />
            </ProtectedRoute>}
        />
        <Route
          path="/create-ticket"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <CreateTicketPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;