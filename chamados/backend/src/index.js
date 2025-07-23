require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API de Chamados rodando!');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Após os requires existentes
const authRoutes = require('./routes/authRoutes');

// Após app.use(express.json());
app.use('/api/auth', authRoutes);

const ticketRoutes = require('./routes/ticketRoutes');

// abaixo do app.use('/api/auth', ...)
app.use('/api/tickets', ticketRoutes);
