// backend/src/controllers/ticketController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getTickets = async (req, res) => {
  const tickets = await prisma.ticket.findMany({
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json(tickets);
};

const createTicket = async (req, res) => {
  const { title } = req.body;
  const userId = req.user.id;
  try {
    const ticket = await prisma.ticket.create({
      data: { title, userId },
      include: { user: true }
    });
    req.io.emit('ticketUpdated', ticket);
    res.status(201).json(ticket);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar chamado', details: err });
  }
};

const updateTicketStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const ticket = await prisma.ticket.update({
      where: { id: parseInt(id) },
      data: { status },
      include: { user: true }
    });
    req.io.emit('ticketUpdated', ticket);
    res.json(ticket);
  } catch (err) {
    console.error("ERRO DO PRISMA AO ATUALIZAR:", err);
    res.status(400).json({ error: 'Erro ao atualizar chamado', details: err });
  }
};

const deleteTicket = async (req, res) => {
  const { id } = req.params;
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Apenas administradores podem excluir chamados' });
  }
  try {
    await prisma.ticket.delete({
      where: { id: parseInt(id) },
    });
    req.io.emit('ticketDeleted', { id: parseInt(id) });
    res.json({ message: 'Chamado deletado com sucesso' });
  } catch (err) {
    res.status(400).json({ error: 'Erro ao deletar chamado', details: err });
  }
};

module.exports = {
  getTickets,
  createTicket,
  updateTicketStatus,
  deleteTicket,
};