// backend/src/controllers/ticketController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// --- BUSCAR TODOS OS CHAMADOS ---
const getTickets = async (req, res) => {
  console.log('--- [LOG] Iniciando busca de todos os chamados...');
  try {
    const tickets = await prisma.ticket.findMany({
      include: {
        user: { select: { name: true } },
        technician: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' },
    });
    console.log(`--- [LOG] Busca concluída. ${tickets.length} chamados encontrados.`);
    res.json(tickets);
  } catch (err) {
    console.error("--- [ERRO] Falha ao buscar chamados:", err);
    res.status(500).json({ error: 'Erro ao buscar chamados.' });
  }
};

// --- CRIAR NOVO CHAMADO ---
const createTicket = async (req, res) => {
  const { title } = req.body;
  const currentUser = req.user; // Contém { id, role }

  // Verificação de segurança e validação
  if (currentUser.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Apenas administradores podem criar chamados.' });
  }
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'O título do chamado é obrigatório.' });
  }

  try {
    const newTicket = await prisma.ticket.create({
      data: { title, status: 'ABERTO', userId: currentUser.id },
      include: { user: { select: { name: true } }, technician: { select: { name: true } } },
    });

    // Notifica todos os clientes conectados sobre o novo chamado
    req.io.emit('ticketUpdated', newTicket);
    res.status(201).json(newTicket);
  } catch (err) {
    console.error("--- [ERRO] Falha ao criar chamado:", err);
    res.status(500).json({ error: 'Erro ao criar o chamado.', details: err.message });
  }
};

const updateTicketStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const currentUser = req.user; // Agora contém { id, role }

  try {
    const ticketToUpdate = await prisma.ticket.findUnique({ where: { id: parseInt(id) } });
    if (!ticketToUpdate) {
      return res.status(404).json({ error: 'Chamado não encontrado.' });
    }

    if (status === 'FECHADO' && ticketToUpdate.technicianId !== null) {
      if (currentUser.id !== ticketToUpdate.technicianId && currentUser.role !== 'ADMIN') { // <-- MUDANÇA AQUI
        return res.status(403).json({ error: 'Apenas o técnico responsável ou um admin pode fechar este chamado.' });
      }
    }

    let dataToUpdate = { status };

    if (status === 'ANDAMENTO') {
      dataToUpdate.technicianId = currentUser.id; // <-- MUDANÇA AQUI
    }

    const ticket = await prisma.ticket.update({
      where: { id: parseInt(id) },
      data: dataToUpdate,
      include: { user: true, technician: true }
    });
    
    req.io.emit('ticketUpdated', ticket);
    res.json(ticket);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao atualizar chamado', details: err.message });
  }
};

// --- DELETAR CHAMADO ---
const deleteTicket = async (req, res) => {
  const { id } = req.params;
  const currentUser = req.user;
  console.log(`--- [LOG] Usuário [ID: ${currentUser.id}] tentando deletar chamado [ID: ${id}]`);

  if (currentUser.role !== 'ADMIN') {
    console.warn(`--- [AVISO] Acesso negado para deletar chamado [ID: ${id}]. Usuário [ID: ${currentUser.id}] não é admin.`);
    return res.status(403).json({ error: 'Apenas administradores podem excluir chamados' });
  }

  try {
    await prisma.ticket.delete({ where: { id: parseInt(id) } });
    console.log(`--- [LOG] Chamado [ID: ${id}] deletado com sucesso.`);
    req.io.emit('ticketDeleted', { id: parseInt(id) });
    res.json({ message: 'Chamado deletado com sucesso' });
  } catch (err) {
    console.error(`--- [ERRO] Falha ao deletar chamado [ID: ${id}]:`, err);
    res.status(400).json({ error: 'Erro ao deletar chamado', details: err.message });
  }
};

module.exports = {
  getTickets,
  createTicket,
  updateTicketStatus,
  deleteTicket,
};