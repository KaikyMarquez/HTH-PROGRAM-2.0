// frontend/src/components/CreateTicketPage.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function CreateTicketPage() {
  const [eventName, setEventName] = useState('');
  const [standName, setStandName] = useState('');
  const [standAddress, setStandAddress] = useState('');
  const [description, setDescription] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    // Validação atualizada com base no backend
    if (!eventName.trim() || !standName.trim() || !description.trim()) {
      setFeedback({ message: 'Nome do evento, nome do estande e descrição são obrigatórios.', type: 'error' });
      return;
    }
    setLoading(true);
    setFeedback({ message: '', type: '' });
    const token = localStorage.getItem('authToken');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          eventName,
          standName,
          standAddress,
          description,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar chamado.');
      }
      setFeedback({ message: `Chamado para "${standName}" criado com sucesso!`, type: 'success' });
      setEventName('');
      setStandName('');
      setStandAddress('');
      setDescription('');
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
          <div className="space-y-6">
            <div>
              <label htmlFor="eventName" className="mb-2 block text-sm font-medium text-gray-300">Nome do Evento</label>
              <input
                id="eventName"
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="Ex: Feira de Tecnologia 2024"
                className="w-full rounded-md border border-slate-600 bg-slate-700 py-3 px-4 text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label htmlFor="standName" className="mb-2 block text-sm font-medium text-gray-300">Nome do Estande</label>
              <input
                id="standName"
                type="text"
                value={standName}
                onChange={(e) => setStandName(e.target.value)}
                placeholder="Ex: Estande Inovação Tech"
                className="w-full rounded-md border border-slate-600 bg-slate-700 py-3 px-4 text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label htmlFor="standAddress" className="mb-2 block text-sm font-medium text-gray-300">Endereço do Estande (Opcional)</label>
              <input
                id="standAddress"
                type="text"
                value={standAddress}
                onChange={(e) => setStandAddress(e.target.value)}
                placeholder="Ex: Pavilhão A, Corredor 5"
                className="w-full rounded-md border border-slate-600 bg-slate-700 py-3 px-4 text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-300">Descrição do Chamado</label>
              <textarea 
                id="description"
                value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descreva o problema ou solicitação detalhadamente..." className="w-full rounded-md border border-slate-600 bg-slate-700 py-3 px-4 text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500" rows="4" required ></textarea>
            </div>
          </div>
          <button type="submit" disabled={loading} className="mt-6 w-full rounded-md bg-emerald-600 px-6 py-3 font-bold text-white shadow-md transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:bg-emerald-800">
            {loading ? 'Criando...' : 'Criar Chamado'}
          </button>
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