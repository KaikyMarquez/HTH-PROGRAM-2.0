const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getTickets,
  createTicket,
  updateTicketStatus,
  deleteTicket,
} = require('../controllers/ticketController');

// Todas as rotas exigem autenticação
router.use(authMiddleware);

router.get('/', getTickets);
router.post('/', createTicket);
router.put('/:id', updateTicketStatus);
router.delete('/:id', deleteTicket);

module.exports = router;
