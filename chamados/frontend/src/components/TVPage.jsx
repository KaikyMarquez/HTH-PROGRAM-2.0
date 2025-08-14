// src/components/TVPage.jsx

import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL);

function TVPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Lógica para buscar os dados iniciais e ouvir o Socket.IO
  useEffect(() => {
    const fetchTickets = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Nenhum token de autenticação encontrado.');
        setLoading(false); return;
      }
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tickets`, { headers: { 'Authorization': `Bearer ${token}` } });
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

    socket.on('connect', () => console.log('✅ TV Conectada ao WebSocket:', socket.id));
    socket.on('ticketUpdated', (updatedTicket) => {
      setTickets(prevTickets => {
        const ticketExists = prevTickets.find(t => t.id === updatedTicket.id);
        if (ticketExists) { return prevTickets.map(t => t.id === updatedTicket.id ? updatedTicket : t); }
        else { return [updatedTicket, ...prevTickets]; }
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
  
  // Filtra para mostrar apenas chamados ABERTOS ou EM ANDAMENTO
  const activeTickets = tickets.filter(
    ticket => ticket.status === 'ABERTO' || ticket.status === 'ANDAMENTO'
  );

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-black text-white text-4xl">Carregando Chamados...</div>;
  if (error) return <div className="flex min-h-screen items-center justify-center bg-black text-red-500 text-4xl">{error}</div>;

  return (
    <div className="min-h-screen bg-black p-8 font-sans text-white">
      <h1 className="mb-8 text-center text-7xl font-bold uppercase tracking-widest">
        Chamados em Aberto
      </h1>
      
      {activeTickets.length > 0 ? (
        <ul className="space-y-6">
          {activeTickets.map(ticket => (
            <li key={ticket.id} className="flex items-center justify-between rounded-lg bg-gray-800 p-6">
              <div className="flex-grow">
                <p className="text-3xl">
                  <span className="font-bold text-sky-400">EVENTO:</span> <span className="font-semibold text-white">{ticket.eventName}</span>
                </p>
                <p className="mt-2 text-5xl">
                  <span className="font-bold text-sky-400">ESTANDE:</span> <span className="font-semibold text-emerald-400">{ticket.standName}</span>
                </p>
              </div>
              <span className={`rounded-full px-6 py-3 text-3xl font-bold
                ${ticket.status === 'ABERTO' ? 'bg-red-600 text-white' : ''}
                ${ticket.status === 'ANDAMENTO' ? 'bg-yellow-500 text-black' : ''}
              `}>
                {ticket.status}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex h-full items-center justify-center">
            <p className="text-5xl text-gray-500">Nenhum chamado ativo no momento.</p>
        </div>
      )}
    </div>
  );
}

export default TVPage;