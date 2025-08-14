// em backend/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Rota pública para login
router.post('/login', login);

// A partir daqui, todas as rotas exigem autenticação
router.use(authMiddleware);

// A partir daqui, todas as rotas exigem que o usuário seja ADMIN
router.use(adminMiddleware);

router.post('/register', register); // Registrar novo usuário
router.get('/users', getAllUsers); // Listar todos os usuários
router.get('/users/:id', getUserById); // Buscar um usuário por ID
router.put('/users/:id', updateUser); // Atualizar um usuário
router.delete('/users/:id', deleteUser); // Deletar um usuário

module.exports = router;
