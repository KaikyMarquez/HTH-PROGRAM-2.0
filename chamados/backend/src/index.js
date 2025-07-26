// backend/src/index.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");

const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // URL do seu frontend
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

app.use(cors());
app.use(express.json());

// Middleware para injetar o `io` em cada requisição ANTES das rotas
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Suas rotas
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);

// Lógica de conexão do Socket.IO
io.on('connection', (socket) => {
  console.log('✅ Um usuário se conectou:', socket.id);
  socket.on('disconnect', () => {
    console.log('❌ Um usuário se desconectou:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});