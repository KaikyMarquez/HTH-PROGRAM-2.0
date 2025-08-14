// backend/src/controllers/authController.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
  }
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Este email já está em uso.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'TECNICO',
      },
    });
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({ message: 'Usuário criado com sucesso!', user: userWithoutPassword });
  } catch (error) {
    console.error("Erro no registro:", error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// CÓDIGO CORRETO E COMPLETO PARA A FUNÇÃO DE LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
  }
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('--- [ERRO CRÍTICO] A variável de ambiente JWT_SECRET não está definida.');
      return res.status(500).json({ message: 'Erro de configuração no servidor.' });
    }

const token = jwt.sign(
  { id: user.id, role: user.role }, // <-- Mude de 'userId' para 'id'
  process.env.JWT_SECRET,
  { expiresIn: '8h' }
);
    
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      message: 'Login bem-sucedido!',
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

// --- BUSCAR UM USUÁRIO POR ID ---
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuário.' });
  }
};

// --- BUSCAR TODOS OS USUÁRIOS ---
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      // Seleciona todos os campos, exceto a senha
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: { name: 'asc' },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários.' });
  }
};

// --- ATUALIZAR USUÁRIO ---
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role, password } = req.body;

  try {
    const dataToUpdate = { name, email, role };
    // Se uma nova senha for fornecida, faz o hash dela
    if (password) {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: dataToUpdate,
      select: { id: true, name: true, email: true, role: true },
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar usuário.', details: error.message });
  }
};

// --- DELETAR USUÁRIO ---
const deleteUser = async (req, res) => {
  const { id } = req.params;
  // Impede que um usuário se auto-delete
  if (req.user.id === parseInt(id)) {
    return res.status(403).json({ error: 'Você não pode excluir sua própria conta.' });
  }
  try {
    await prisma.user.delete({ where: { id: parseInt(id) } });
    res.status(204).send(); // 204 No Content
  } catch (error) {
    res.status(400).json({ error: 'Erro ao deletar usuário.', details: error.message });
  }
};

module.exports = {
  register,
  login,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
};