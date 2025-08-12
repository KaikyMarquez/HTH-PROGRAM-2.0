// frontend/src/components/UnauthorizedPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';

function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-6xl font-bold text-red-500">403</h1>
      <h2 className="mb-4 text-2xl">Acesso Negado</h2>
      <p className="mb-8 text-gray-400">Você não tem permissão para visualizar esta página.</p>
      <Link to="/dashboard" className="rounded bg-emerald-600 px-4 py-2 font-bold text-white transition hover:bg-emerald-700">Voltar ao Dashboard</Link>
    </div>
  );
}

export default UnauthorizedPage;