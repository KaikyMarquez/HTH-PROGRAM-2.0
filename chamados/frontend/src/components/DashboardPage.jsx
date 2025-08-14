// frontend/src/components/DashboardPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import io from 'socket.io-client';
import TicketCard from './TicketCard';

const socket = io(import.meta.env.VITE_API_URL);

function DashboardPage() {
  // Estados existentes
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  const navigate = useNavigate();
  const user = useMemo(() => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }, []);

  // Efeito para atualizar a hora atual a cada minuto, para a lógica de urgência
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 1 minuto
    return () => clearInterval(timer);
  }, []);

  // Efeito para buscar os chamados iniciais quando o componente carrega
  useEffect(() => {
    const fetchTickets = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Nenhum token de autenticação encontrado.');
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tickets`, {
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
    fetchTickets();
  }, []);

  // Efeito para configurar os listeners do Socket.IO
  useEffect(() => {
    socket.on('connect', () => console.log('✅ Conectado ao WebSocket'));

    socket.on('ticketUpdated', (updatedTicket) => {
      setTickets(prevTickets => {
        const ticketExists = prevTickets.find(t => t.id === updatedTicket.id);
        if (ticketExists) {
          return prevTickets.map(t => t.id === updatedTicket.id ? updatedTicket : t);
        } else {
          new Audio('/sounds/notification.mp3').play();
          return [updatedTicket, ...prevTickets];
        }
      });
    });

    socket.on('ticketDeleted', (deletedTicket) => {
      setTickets(prevTickets => prevTickets.filter(t => t.id !== deletedTicket.id));
    });

    return () => {
      socket.off('connect');
      socket.off('ticketUpdated');
      socket.off('ticketDeleted');
    };
  }, []);

  const handleUpdateStatus = async (ticketId, newStatus) => {
    const token = localStorage.getItem('authToken');
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/tickets/${ticketId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    if (!window.confirm('Tem certeza que deseja excluir este chamado?')) return;
    const token = localStorage.getItem('authToken');
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/tickets/${ticketId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const getTicketUrgencyStyle = (createdAt, status) => {
    // Se o chamado não estiver aberto, ele tem uma cor de fundo padrão e não precisa de mais cálculos.
    if (status !== 'ABERTO') {
      return { backgroundColor: '#666666' }; // Cor cinza escuro (slate-800)
    }
    const minutesAgo = (currentTime.getTime() - new Date(createdAt).getTime()) / 60000;
    
    // NOTA: Tempos reduzidos para facilitar o teste. Mude para 15 e 30 minutos em produção.
    if (minutesAgo < 15) { return { backgroundColor: '#065f46' }; } // Verde (emerald-800)
    else if (minutesAgo <= 20) { return { backgroundColor: '#b45309' }; } // Amarelo (amber-700)
    else { return { backgroundColor: '#991b1b' }; } // Vermelho (red-800)
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">Carregando...</div>;
  if (error) return <div className="flex min-h-screen items-center justify-center bg-gray-900 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-slate-900 p-4 text-white sm:p-6 lg:p-8">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-700 pb-6">
        <h1 className="text-4xl font-bold">Painel de Chamados</h1>
        <div className="flex items-center gap-2 rounded-lg bg-slate-800 p-1">
          {user && user.role === 'ADMIN' && (
            <>
              <Link to="/create-ticket" className="flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                Criar Chamado
              </Link>
              <Link to="/manage-users" className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg>
                Gerenciar Usuários
              </Link>
            </>
          )}
          <button onClick={handleLogout} className="flex items-center gap-2 rounded-md bg-slate-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" /></svg>
            Sair
          </button>
        </div>
      </header>
      
      <section>
        <h2 className="mb-6 text-2xl font-semibold text-gray-300">Visão Geral dos Chamados</h2>
        <main className="flex flex-wrap gap-6">
          {tickets.map(ticket => ( <TicketCard key={ticket.id} ticket={ticket} user={user} onUpdateStatus={handleUpdateStatus} onDelete={handleDeleteTicket} urgencyStyle={getTicketUrgencyStyle(ticket.createdAt, ticket.status)} /> ))}
        </main>
      </section>
    </div>
  );
}

export default DashboardPage;