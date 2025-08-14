// frontend/src/components/RegisterUserPage.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function RegisterUserPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('TECNICO'); // Valor padrão
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setFeedback({ message: '', type: '' });
    setLoading(true);
    const token = localStorage.getItem('authToken');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await response.json();
      if (!response.ok) { throw new Error(data.error || 'Erro ao criar usuário.'); }
      setFeedback({ message: `Usuário '${name}' criado com sucesso!`, type: 'success' });
      setName(''); setEmail(''); setPassword('');
    } catch (err) {
      setFeedback({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4 text-white">
      <div className="w-full max-w-md rounded-lg bg-slate-800 p-8 shadow-md">
        <h2 className="mb-8 text-center text-3xl font-bold text-blue-400">Cadastrar Novo Usuário</h2>
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300" htmlFor="name">Nome Completo</label>
            <input id="name" required type="text" placeholder="Nome do usuário" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border border-slate-600 bg-slate-700 p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300" htmlFor="email">Email</label>
            <input id="email" required type="email" placeholder="usuario@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border border-slate-600 bg-slate-700 p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300" htmlFor="password">Senha</label>
            <input id="password" required type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-md border border-slate-600 bg-slate-700 p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300" htmlFor="role">Função</label>
            <select id="role" value={role} onChange={(e) => setRole(e.target.value)} className="w-full rounded-md border border-slate-600 bg-slate-700 p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="TECNICO">Técnico</option> <option value="ADMIN">Admin</option> <option value="VISUALIZADOR">Visualizador</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className="w-full rounded-md bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-800">{loading ? 'Cadastrando...' : 'Cadastrar Usuário'}</button>
          {feedback.message && <p className={`mt-4 text-center text-sm ${feedback.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>{feedback.message}</p>}
        </form>
        <div className="mt-6 text-center"><Link to="/dashboard" className="text-sm text-emerald-400 hover:underline">Voltar ao Dashboard</Link></div>
      </div>
    </div>
  );
}

export default RegisterUserPage;