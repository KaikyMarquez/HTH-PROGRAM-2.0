// em backend/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController'); // Importe a função register
const adminMiddleware = require('../middleware/adminMiddleware'); // Importe o novo middleware

// Rota para registrar um novo usuário
router.post('/register', register);

// Rota para fazer login
router.post('/login', login);

module.exports = router;
