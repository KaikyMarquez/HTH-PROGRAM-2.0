// frontend/src/components/EditUserPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

function EditUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('TECNICO');
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/users/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error('Usuário não encontrado ou falha ao carregar dados.');
        }
        const userData = await response.json();
        setName(userData.name);
        setEmail(userData.email);
        setRole(userData.role);
      } catch (err) {
        setPageError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, token]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setFeedback({ message: '', type: '' });
    setLoading(true);

    const dataToUpdate = { name, email, role };
    if (password) {
      dataToUpdate.password = password;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(dataToUpdate),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao atualizar usuário.');
      }
      setFeedback({ message: `Usuário '${name}' atualizado com sucesso!`, type: 'success' });
      setTimeout(() => navigate('/manage-users'), 2000);
    } catch (err) {
      setFeedback({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (pageError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4 text-white">
        <p className="text-red-500">{pageError}</p>
        <Link to="/manage-users" className="mt-4 text-sm text-emerald-400 hover:underline">Voltar para Gerenciar Usuários</Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4 text-white">
      <div className="w-full max-w-md rounded-lg bg-slate-800 p-8 shadow-md">
        <h2 className="mb-8 text-center text-3xl font-bold text-yellow-400">Editar Usuário</h2>
        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300" htmlFor="name">Nome Completo</label>
            <input id="name" required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border border-slate-600 bg-slate-700 p-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300" htmlFor="email">Email</label>
            <input id="email" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border border-slate-600 bg-slate-700 p-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300" htmlFor="password">Nova Senha (opcional)</label>
            <input id="password" type="password" placeholder="Deixe em branco para não alterar" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-md border border-slate-600 bg-slate-700 p-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300" htmlFor="role">Função</label>
            <select id="role" value={role} onChange={(e) => setRole(e.target.value)} className="w-full rounded-md border border-slate-600 bg-slate-700 p-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500">
              <option value="TECNICO">Técnico</option>
              <option value="ADMIN">Admin</option>
              <option value="VISUALIZADOR">Visualizador</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className="w-full rounded-md bg-yellow-600 py-3 font-bold text-white transition hover:bg-yellow-700 disabled:cursor-not-allowed disabled:bg-yellow-800">
            {loading ? 'Atualizando...' : 'Atualizar Usuário'}
          </button>
          {feedback.message && <p className={`mt-4 text-center text-sm ${feedback.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>{feedback.message}</p>}
        </form>
        <div className="mt-6 text-center"><Link to="/manage-users" className="text-sm text-emerald-400 hover:underline">Voltar para Gerenciar Usuários</Link></div>
      </div>
    </div>
  );
}

export default EditUserPage;