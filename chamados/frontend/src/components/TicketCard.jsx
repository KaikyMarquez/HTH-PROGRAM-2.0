// src/components/TicketCard.jsx

import React from 'react';

function TicketCard({ ticket, user, onUpdateStatus, onDelete, urgencyClass }) {
  return (
    <div className={`flex flex-col rounded-lg p-6 shadow-md ${urgencyClass}`}>
      <div className="flex-grow">
        <h2 className="mb-2 text-xl font-bold text-emerald-400">{ticket.title}</h2>
        <p className="mb-4 text-sm text-gray-400">Criado por: {ticket.user.name}</p>
        <div className="flex justify-between">
          <span className="text-xs font-semibold">{ticket.status}</span>
          <span className="text-xs text-gray-500">{new Date(ticket.createdAt).toLocaleDateString('pt-BR')}</span>
        </div>
      </div>

      {user && (user.role === 'ADMIN' || user.role === 'TECNICO') && (
        <div className="mt-6 flex gap-2 border-t border-slate-700 pt-4">
          {ticket.status === 'ABERTO' && (
            <button
              onClick={() => onUpdateStatus(ticket.id, 'ANDAMENTO')}
              className="flex-1 rounded bg-yellow-600 px-3 py-1 text-xs font-bold transition hover:bg-yellow-700"
            >
              Iniciar
            </button>
          )}
          {ticket.status === 'ANDAMENTO' && (
            <button
              onClick={() => onUpdateStatus(ticket.id, 'FECHADO')}
              className="flex-1 rounded bg-green-600 px-3 py-1 text-xs font-bold transition hover:bg-green-700"
            >
              Fechar Chamado
            </button>
          )}
          {user.role === 'ADMIN' && (
            <button
              onClick={() => onDelete(ticket.id)}
              className="flex-1 rounded bg-red-800 px-3 py-1 text-xs font-bold text-white transition hover:bg-red-700"
            >
              Excluir
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default TicketCard;