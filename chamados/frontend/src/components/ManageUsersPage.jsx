// frontend/src/components/ManageUsersPage.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// --- NOVO: Componente para o selo de função ---
const RoleBadge = ({ role }) => {
  const roleStyles = {
    ADMIN: 'bg-red-500/20 text-red-400 border border-red-500/30',
    TECNICO: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    VISUALIZADOR: 'bg-green-500/20 text-green-400 border border-green-500/30',
  };
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${roleStyles[role] || 'bg-gray-500/20 text-gray-400'}`}>
      {role}
    </span>
  );
};
function ManageUsersPage() {
  // --- NOVO: Estado para a lista de usuários ---
  const [users, setUsers] = useState([]);
  const [pageError, setPageError] = useState('');

  // Estados para o formulário de registro
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('TECNICO'); // Valor padrão
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('authToken');

  const handleRegister = async (e) => {
    e.preventDefault();
    setFeedback({ message: '', type: '' });
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await response.json();
      if (!response.ok) { throw new Error(data.error || 'Erro ao criar usuário.'); }
      setFeedback({ message: `Usuário '${name}' criado com sucesso!`, type: 'success' });
      fetchUsers(); // --- NOVO: Atualiza a lista após o cadastro
      setName(''); setEmail(''); setPassword('');
    } catch (err) {
      setFeedback({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // --- NOVO: Função para buscar usuários ---
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/users`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Falha ao carregar usuários.');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setPageError(err.message);
    }
  };

  // --- NOVO: Efeito para buscar usuários quando o componente carregar ---
  useEffect(() => {
    fetchUsers();
  }, []);

  // --- NOVO: Função para deletar um usuário ---
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.')) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao excluir usuário.');
      }
      // Remove o usuário da lista local para feedback imediato
      setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      setFeedback({ message: err.message, type: 'error' });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4 text-white">
      <div className="w-full max-w-4xl space-y-8">
        {/* Formulário de Cadastro */}
        <div className="rounded-lg bg-slate-800 p-8 shadow-md">
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
        </div>

        {/* --- NOVO: Lista de Usuários --- */}
        <div className="rounded-lg bg-slate-800 p-8 shadow-md">
          <h2 className="mb-8 text-center text-3xl font-bold text-blue-400">Usuários Cadastrados</h2>
          {pageError && <p className="text-red-400">{pageError}</p>}
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg bg-slate-700 p-4 transition-colors hover:bg-slate-600/50">
                <div className="flex-grow">
                  <p className="truncate text-lg font-bold text-white">{user.name}</p>
                  <p className="truncate text-sm text-gray-400">{user.email}</p>
                  <div className="mt-2">
                    <RoleBadge role={user.role} />
                  </div>
                </div>
                <div className="flex flex-shrink-0 items-center gap-2">
                    <Link to={`/edit-user/${user.id}`} className="flex items-center justify-center gap-2 rounded-md bg-yellow-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-yellow-700" title="Editar Usuário">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                      <span>Editar</span>
                    </Link>
                    <button onClick={() => handleDeleteUser(user.id)} className="flex items-center justify-center gap-2 rounded-md bg-red-700 px-3 py-2 text-xs font-bold text-white transition hover:bg-red-800" title="Excluir Usuário">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                      <span>Excluir</span>
                    </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center"><Link to="/dashboard" className="text-sm text-emerald-400 hover:underline">Voltar ao Dashboard</Link></div>
      </div>
    </div>
  );
}

export default ManageUsersPage;