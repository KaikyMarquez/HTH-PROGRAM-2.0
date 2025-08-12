// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import TVPage from './components/TVPage';
import RegisterUserPage from './components/RegisterUserPage';
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
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/tv" element={<ProtectedRoute><TVPage /></ProtectedRoute>} />
        <Route 
          path="/register-user" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <RegisterUserPage />
            </ProtectedRoute>} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;