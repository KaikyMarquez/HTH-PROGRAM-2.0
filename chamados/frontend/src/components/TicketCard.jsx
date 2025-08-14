// frontend/src/components/TicketCard.jsx

import React from 'react';

const StatusBadge = ({ status }) => {
  const statusStyles = {
    ABERTO: 'bg-red-500/20 text-red-400',
    ANDAMENTO: 'bg-yellow-500/20 text-yellow-400',
    FECHADO: 'bg-green-500/20 text-green-400',
  };
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${statusStyles[status] || 'bg-gray-500/20 text-gray-400'}`}>
      {status}
    </span>
  );
};

function TicketCard({ ticket, user, onUpdateStatus, onDelete, urgencyStyle }) {
  const canCloseTicket = user && (user.role === 'ADMIN' || user.id === ticket.technicianId);

  return (
    <div className="relative flex h-[348px] w-[305px] flex-col rounded-lg shadow-lg transition-all duration-300 hover:-translate-y-1 border border-black transition-colors duration-1000 ease-in-out" style={urgencyStyle}>
      <div className="flex h-full flex-col p-6 text-white">
        <div className="flex-grow">
          <div className="mb-4 flex items-center justify-between">
            <StatusBadge status={ticket.status} />
            <span className="text-xs text-gray-500">{new Date(ticket.createdAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
          </div>

          <p className="mb-2 truncate text-lg" title={ticket.eventName}><span className="font-bold text-sky-400">EVENTO:</span> <span className="text-gray-100">{ticket.eventName}</span></p>
          <p className="mb-1 text-sm"><span className="font-bold text-sky-400">ESTANDE:</span> <span className="text-emerald-400">{ticket.standName}</span></p>
          {ticket.standAddress && <p className="mb-3 text-xs"><span className="font-bold text-sky-400">ENDEREÇO:</span> <span className="text-gray-400">{ticket.standAddress}</span></p>}
          <div className="mb-4">
            <p className="font-bold text-sky-400 text-sm">DESCRIÇÃO:</p>
            <p className="text-sm text-gray-300 line-clamp-3">{ticket.description}</p>
          </div>
<br />
<br />

          <div className="mt-auto space-y-1 text-sm text-gray-400">
            {ticket.technician && (
              <p className="font-bold text-cyan-400"><span className="font-semibold text-gray-400">Atendido por:</span> {ticket.technician.name}</p>
            )}
            <p><span className="font-semibold">Criado por:</span> {ticket.user?.name || 'Sistema'}</p>
          </div>
        </div>

        {user && (user.role === 'ADMIN' || user.role === 'TECNICO') && (
          <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-700 pt-4">
            {ticket.status === 'ABERTO' && (
              <button
                onClick={() => onUpdateStatus(ticket.id, 'ANDAMENTO')}
                className="flex items-center justify-center gap-2 rounded-md bg-yellow-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-yellow-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                Iniciar
              </button>
            )}
            {ticket.status === 'ANDAMENTO' && (
              <button
                onClick={() => onUpdateStatus(ticket.id, 'FECHADO')}
                disabled={!canCloseTicket}
                className="flex items-center justify-center gap-2 rounded-md bg-green-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-600"
                title={!canCloseTicket ? "Apenas o técnico responsável ou um admin pode fechar" : ""}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Fechar
              </button>
            )}
            {user.role === 'ADMIN' && (
              <button
                onClick={() => onDelete(ticket.id)}
                className="flex items-center justify-center gap-2 rounded-md bg-red-800/80 px-4 py-2 text-xs font-bold text-white transition hover:bg-red-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                Excluir
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TicketCard;