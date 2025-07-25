// src/components/DashboardPage.jsx

import React, { useState, useEffect, useMemo } from 'react';

function DashboardPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newTicketTitle, setNewTicketTitle] = useState('');

  const user = useMemo(() => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }, []);

  const fetchTickets = async () => {
    // ... (esta função continua a mesma)
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Nenhum token de autenticação encontrado.');
      setLoading(false); return;
    }
    try {
      const response = await fetch('http://localhost:3001/api/tickets', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Falha ao buscar os chamados.');
      const data = await response.json();
      setTickets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCreateTicket = async (e) => {
    // ... (esta função continua a mesma)
    e.preventDefault();
    if (!newTicketTitle.trim()) return;
    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch('http://localhost:3001/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTicketTitle }),
      });
      if (!response.ok) throw new Error('Erro ao criar o chamado.');
      setNewTicketTitle('');
      fetchTickets();
    } catch (err) {
      setError(err.message);
    }
  };

  // NOVA FUNÇÃO: Para atualizar o status de um chamado
  const handleUpdateStatus = async (ticketId, newStatus) => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch(`http://localhost:3001/api/tickets/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error('Erro ao atualizar o status.');
      
      fetchTickets(); // Atualiza a lista para refletir a mudança
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">Carregando...</div>;
  if (error) return <div className="flex min-h-screen items-center justify-center bg-gray-900 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-white">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">Painel de Chamados</h1>
      </header>
      
      {/* Formulário de criação continua o mesmo... */}
      {user && user.role === 'ADMIN' && (
        <div className="mb-8 rounded-lg bg-slate-800 p-6">
          <form onSubmit={handleCreateTicket} className="flex gap-4">
            <input type="text" value={newTicketTitle} onChange={(e) => setNewTicketTitle(e.target.value)}
              placeholder="Título do novo chamado" className="flex-grow rounded bg-gray-700 p-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <button type="submit" className="rounded bg-emerald-600 px-6 py-2 font-bold text-white transition hover:bg-emerald-700">Criar</button>
          </form>
        </div>
      )}
      
      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tickets.length > 0 ? (
          tickets.map(ticket => (
            <div key={ticket.id} className="flex flex-col justify-between rounded-lg bg-slate-800 p-6 shadow-md">
              <div>
                <h2 className="mb-2 text-xl font-bold text-emerald-400">{ticket.title}</h2>
                <p className="mb-4 text-sm text-gray-400">Criado por: {ticket.user.name}</p>
                <div className="flex justify-between">
                  <span className="text-xs font-semibold">{ticket.status}</span>
                  <span className="text-xs text-gray-500">{new Date(ticket.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>

              {/* NOVOS BOTÕES: Ações de status (só aparecem para ADMIN e TECNICO) */}
              {user && (user.role === 'ADMIN' || user.role === 'TECNICO') && (
                <div className="mt-6 flex gap-2 border-t border-slate-700 pt-4">
                  {ticket.status === 'ABERTO' && (
                    <button onClick={() => handleUpdateStatus(ticket.id, 'ANDAMENTO')}
                      className="flex-1 rounded bg-yellow-600 px-3 py-1 text-xs font-bold transition hover:bg-yellow-700">
                      Iniciar
                    </button>
                  )}
                  {ticket.status === 'ANDAMENTO' && (
                    <button onClick={() => handleUpdateStatus(ticket.id, 'FECHADO')}
                      className="flex-1 rounded bg-green-600 px-3 py-1 text-xs font-bold transition hover:bg-green-700">
                      Fechar Chamado
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>Nenhum chamado encontrado.</p>
        )}
      </main>
    </div>
  );
}

export default DashboardPage;