// frontend/src/components/LoginPage.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
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
            <input type="email" id="email" placeholder="seuemail@exemplo.com" className="w-full rounded bg-gray-700 p-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="mb-2 block text-sm font-bold text-gray-300">Senha</label>
            <input type="password" id="password" placeholder="********" className="w-full rounded bg-gray-700 p-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && (<div className="mb-4 rounded bg-red-900/50 p-3 text-center text-sm text-red-400">{error}</div>)}
          <button type="submit" className="w-full rounded bg-emerald-600 py-2 font-bold text-white transition duration-300 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-800" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </main>
  );
}

export default LoginPage;