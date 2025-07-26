// frontend/src/components/DashboardPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import TicketCard from './TicketCard';

const socket = io('http://localhost:3001');

function DashboardPage() {
  // Estados existentes
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newTicketTitle, setNewTicketTitle] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // NOVOS ESTADOS para o formulário de registro de usuário
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('TECNICO'); // Valor padrão
  const [regFeedback, setRegFeedback] = useState({ message: '', type: '' });

  const navigate = useNavigate();
  const user = useMemo(() => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }, []);

  useEffect(() => { const timer = setInterval(() => { setCurrentTime(new Date()); }, 60000); return () => clearInterval(timer); }, []);
  useEffect(() => { const fetchTickets = async () => { const token = localStorage.getItem('authToken'); if (!token) { setError('Nenhum token...'); setLoading(false); return; } try { const response = await fetch('http://localhost:3001/api/tickets', { headers: { 'Authorization': `Bearer ${token}` } }); if (!response.ok) throw new Error('Falha...'); const data = await response.json(); setTickets(data); } catch (err) { setError(err.message); } finally { setLoading(false); } }; fetchTickets(); }, []);
  useEffect(() => { socket.on('connect', () => console.log('✅ Conectado')); socket.on('ticketUpdated', (updatedTicket) => { setTickets(prev => { const exists = prev.find(t => t.id === updatedTicket.id); if (exists) { return prev.map(t => t.id === updatedTicket.id ? updatedTicket : t); } else { new Audio('/sounds/notification.mp3').play(); return [updatedTicket, ...prev]; } }); }); socket.on('ticketDeleted', (deletedTicket) => { setTickets(prev => prev.filter(t => t.id !== deletedTicket.id)); }); return () => { socket.off('connect'); socket.off('ticketUpdated'); socket.off('ticketDeleted'); }; }, []);
  const handleCreateTicket = async (e) => { e.preventDefault(); if (!newTicketTitle.trim()) return; const token = localStorage.getItem('authToken'); try { await fetch('http://localhost:3001/api/tickets', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ title: newTicketTitle }), }); setNewTicketTitle(''); } catch (err) { setError(err.message); } };
  const handleUpdateStatus = async (ticketId, newStatus) => { const token = localStorage.getItem('authToken'); try { await fetch(`http://localhost:3001/api/tickets/${ticketId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ status: newStatus }), }); } catch (err) { setError(err.message); } };
  const handleDeleteTicket = async (ticketId) => { if (!window.confirm('Tem certeza?')) return; const token = localStorage.getItem('authToken'); try { await fetch(`http://localhost:3001/api/tickets/${ticketId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } }); } catch (err) { setError(err.message); } };
  const handleLogout = () => { localStorage.clear(); navigate('/login'); };
  
  const handleRegister = async (e) => {
    e.preventDefault();
    setRegFeedback({ message: '', type: '' });
    const token = localStorage.getItem('authToken');
    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name: regName, email: regEmail, password: regPassword, role: regRole })
      });
      const data = await response.json();
      if (!response.ok) { throw new Error(data.error || 'Erro ao criar usuário.'); }
      setRegFeedback({ message: `Usuário '${regName}' criado com sucesso!`, type: 'success' });
      setRegName(''); setRegEmail(''); setRegPassword('');
    } catch (err) {
      setRegFeedback({ message: err.message, type: 'error' });
    }
  };

  // AQUI É ONDE 'currentTime' É USADA
  const getTicketUrgencyClass = (createdAt, status) => {
    if (status !== 'ABERTO') { return 'bg-slate-800'; }
    const minutesAgo = (currentTime.getTime() - new Date(createdAt).getTime()) / 60000;
    if (minutesAgo < 15) { return 'bg-green-500/20'; }
    else if (minutesAgo <= 30) { return 'bg-yellow-500/20'; }
    else { return 'bg-red-500/20'; }
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">Carregando...</div>;
  if (error) return <div className="flex min-h-screen items-center justify-center bg-gray-900 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-900 p-8 text-white">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">Painel de Chamados</h1>
        <button onClick={handleLogout} className="rounded bg-red-600 px-4 py-2 font-bold text-white transition hover:bg-red-700">Sair</button>
      </header>
      
      {user && user.role === 'ADMIN' && (
        <section className="mb-12 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="rounded-lg bg-slate-800 p-6">
            <h3 className="mb-4 text-xl font-bold">Criar Novo Chamado</h3>
            <form onSubmit={handleCreateTicket} className="flex gap-4">
              <input type="text" value={newTicketTitle} onChange={(e) => setNewTicketTitle(e.target.value)} placeholder="Título do chamado" className="flex-grow rounded bg-gray-700 p-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              <button type="submit" className="rounded bg-emerald-600 px-6 py-2 font-bold text-white transition hover:bg-emerald-700">Criar</button>
            </form>
          </div>
          <div className="rounded-lg bg-slate-800 p-6">
            <h3 className="mb-4 text-xl font-bold">Cadastrar Novo Usuário</h3>
            <form onSubmit={handleRegister}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input required type="text" placeholder="Nome" value={regName} onChange={(e) => setRegName(e.target.value)} className="rounded bg-gray-700 p-2 text-white" />
                <input required type="email" placeholder="Email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} className="rounded bg-gray-700 p-2 text-white" />
                <input required type="password" placeholder="Senha" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} className="rounded bg-gray-700 p-2 text-white" />
                <select value={regRole} onChange={(e) => setRegRole(e.target.value)} className="rounded bg-gray-700 p-2 text-white">
                  <option value="TECNICO">Técnico</option>
                  <option value="ADMIN">Admin</option>
                  <option value="VISUALIZADOR">Visualizador</option>
                </select>
              </div>
              <button type="submit" className="mt-4 w-full rounded bg-blue-600 py-2 font-bold text-white transition hover:bg-blue-700">Cadastrar Usuário</button>
              {regFeedback.message && (
                <p className={`mt-4 text-center text-sm ${regFeedback.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                  {regFeedback.message}
                </p>
              )}
            </form>
          </div>
        </section>
      )}
      
      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tickets.map(ticket => ( <TicketCard key={ticket.id} ticket={ticket} user={user} onUpdateStatus={handleUpdateStatus} onDelete={handleDeleteTicket} urgencyClass={getTicketUrgencyClass(ticket.createdAt, ticket.status)} /> ))}
      </main>
    </div>
  );
}

export default DashboardPage;