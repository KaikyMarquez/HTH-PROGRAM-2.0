// frontend/src/components/LoginPage.jsx

import { useState } from 'react';
// 1. O 'useNavigate' não é mais necessário aqui. Removido.

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // 2. Não precisamos mais inicializar o navigate.

  const handleSubmit = async (event) => {
    event.preventDefault(); 
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao fazer login.');
      }

      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // 3. A MUDANÇA PRINCIPAL: Usamos o comando direto do navegador
      window.location.href = '/dashboard';

    } catch (err) {
      setError(err.message);
      setLoading(false); 
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-sm rounded-lg bg-slate-800 p-8 shadow-md">
        <h2 className="mb-6 text-center text-3xl font-bold text-white">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="mb-2 block text-sm font-bold text-gray-300">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded bg-gray-700 p-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="mb-2 block text-sm font-bold text-gray-300">Senha</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full rounded bg-gray-700 p-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          {error && (<div className="mb-4 rounded bg-red-900/50 p-3 text-center text-sm text-red-400">{error}</div>)}
          <button type="submit" disabled={loading} className="w-full rounded bg-emerald-600 py-2 font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-800">
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </main>
  );
}

export default LoginPage;