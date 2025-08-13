// frontend/src/components/CreateTicketPage.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function CreateTicketPage() {
  const [title, setTitle] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setFeedback({ message: 'O título do chamado não pode estar vazio.', type: 'error' });
      return;
    }
    setLoading(true);
    setFeedback({ message: '', type: '' });
    const token = localStorage.getItem('authToken');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar chamado.');
      }
      setFeedback({ message: `Chamado "${title}" criado com sucesso!`, type: 'success' });
      setTitle('');
      // Opcional: Redireciona de volta para o dashboard após 2 segundos
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setFeedback({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 p-4 text-white">
      <div className="w-full max-w-2xl rounded-lg bg-slate-800 p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold text-emerald-400">Criar Novo Chamado</h2>
        <form onSubmit={handleCreateTicket}>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-grow">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
              </span>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Descreva o problema ou solicitação..." className="w-full rounded-md border-transparent bg-slate-700 py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500" required />
            </div>
            <button type="submit" disabled={loading} className="flex-shrink-0 rounded-md bg-emerald-600 px-6 py-2 font-bold text-white shadow-md transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:bg-emerald-800">
              {loading ? 'Criando...' : 'Criar Chamado'}
            </button>
          </div>
          {feedback.message && (
            <p className={`mt-4 text-center text-sm ${feedback.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>{feedback.message}</p>
          )}
        </form>
        <div className="mt-6 text-center">
          <Link to="/dashboard" className="text-sm text-blue-400 hover:underline">Voltar ao Dashboard</Link>
        </div>
      </div>
    </div>
  );
}

export default CreateTicketPage;