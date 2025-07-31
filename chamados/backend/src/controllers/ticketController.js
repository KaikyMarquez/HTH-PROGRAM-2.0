const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET: Busca tickets e junta os dados do técnico manualmente
const getTickets = async (req, res) => {
  try {
    const tickets = await prisma.ticket.findMany({
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const technicianIds = tickets.map(ticket => ticket.technicianId).filter(id => id);
    let techniciansMap = new Map();

    if (technicianIds.length > 0) {
      const technicians = await prisma.user.findMany({
        where: { id: { in: technicianIds } },
        select: { id: true, name: true },
      });
      techniciansMap = new Map(technicians.map(tech => [tech.id, tech]));
    }

    const ticketsWithTechnician = tickets.map(ticket => ({
      ...ticket,
      technician: ticket.technicianId ? techniciansMap.get(ticket.technicianId) : null,
    }));

    res.json(ticketsWithTechnician);
  } catch (err) {
    console.error("Erro ao buscar tickets:", err);
    res.status(500).json({ error: 'Erro ao buscar chamados.' });
  }
};

// CREATE: Cria o ticket e depois busca os dados completos para retornar
const createTicket = async (req, res) => {
  const { title } = req.body;
  const userId = req.user.userId;
  try {
    const ticket = await prisma.ticket.create({
      data: { title, userId },
    });

    const newTicketWithDetails = await prisma.ticket.findUnique({
      where: { id: ticket.id },
      include: { user: { select: { name: true } }, technician: { select: { name: true } } },
    });
    
    req.io.emit('ticketUpdated', newTicketWithDetails);
    res.status(201).json(newTicketWithDetails);
  } catch (err) {
    console.error("ERRO AO CRIAR TICKET:", err);
    res.status(400).json({ error: 'Erro ao criar chamado', details: err.message });
  }
};

// UPDATE: Lógica completa para atribuir e verificar o técnico
const updateTicketStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const currentUser = req.user;

  try {
    const ticketToUpdate = await prisma.ticket.findUnique({ where: { id: parseInt(id) } });
    if (!ticketToUpdate) {
      return res.status(404).json({ error: 'Chamado não encontrado.' });
    }

    if (status === 'FECHADO' && ticketToUpdate.technicianId !== null) {
      if (currentUser.userId !== ticketToUpdate.technicianId && currentUser.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Apenas o técnico responsável ou um admin pode fechar este chamado.' });
      }
    }

    let dataToUpdate = { status };
    if (status === 'ANDAMENTO') {
      dataToUpdate.technicianId = currentUser.userId;
    }

    const ticket = await prisma.ticket.update({
      where: { id: parseInt(id) },
      data: dataToUpdate,
      include: { user: { select: { name: true } }, technician: { select: { name: true } } }
    });
    
    req.io.emit('ticketUpdated', ticket);
    res.json(ticket);
  } catch (err) {
    console.error("ERRO AO ATUALIZAR STATUS:", err);
    res.status(400).json({ error: 'Erro ao atualizar chamado', details: err.message });
  }
};

// DELETE: Lógica de exclusividade de admin
const deleteTicket = async (req, res) => {
  const { id } = req.params;
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Apenas administradores podem excluir chamados' });
  }
  try {
    await prisma.ticket.delete({ where: { id: parseInt(id) } });
    req.io.emit('ticketDeleted', { id: parseInt(id) });
    res.json({ message: 'Chamado deletado com sucesso' });
  } catch (err) {
    res.status(400).json({ error: 'Erro ao deletar chamado', details: err.message });
  }
};

module.exports = {
  getTickets,
  createTicket,
  updateTicketStatus,
  deleteTicket,
};