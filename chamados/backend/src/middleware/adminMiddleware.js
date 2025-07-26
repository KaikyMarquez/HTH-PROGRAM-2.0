const adminMiddleware = (req, res, next) => {
  // Este middleware deve rodar DEPOIS do authMiddleware,
  // então já teremos o req.user disponível.
  if (req.user && req.user.role === 'ADMIN') {
    next(); // O usuário é admin, pode prosseguir
  } else {
    // O usuário não é admin, retorna erro de "Proibido"
    res.status(403).json({ error: 'Acesso negado. Rota exclusiva para administradores.' });
  }
};