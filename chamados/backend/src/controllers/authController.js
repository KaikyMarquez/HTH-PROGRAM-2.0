// Em backend/src/controllers/authController.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

// 👇 ADICIONE ESTA NOVA FUNÇÃO
const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validação básica
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
  }

  try {
    // Verifica se o email já existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Este email já está em uso.' }); // 409 Conflict
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o usuário no banco de dados
    // Por padrão, novos usuários serão 'TECNICO'. Você pode mudar essa lógica se quiser.
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'TECNICO', // Se nenhuma role for enviada, define como TECNICO
      },
    });

    // Remove a senha da resposta por segurança
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({ message: 'Usuário criado com sucesso!', user: userWithoutPassword });

  } catch (error) {
    console.error("Erro no registro:", error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};


const login = async (req, res) => {
  // ... sua função de login existente ...
};


module.exports = {
  register, // Exporte a nova função
  login,
};