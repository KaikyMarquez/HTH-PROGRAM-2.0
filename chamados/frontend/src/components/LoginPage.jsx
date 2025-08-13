// frontend/src/components/LoginPage.jsx

import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Efeito para mudar o título da página e garantir que o fundo ocupe a tela toda
  useEffect(() => {
    document.title = 'Login - HTH';
    // Remove margens do body que podem causar as "bordas brancas"
    document.body.style.margin = '0';

    // A solução ideal é garantir que seu arquivo CSS global (ex: index.css)
    // contenha as diretivas do Tailwind, que já fazem esse reset:
    // @tailwind base;
    // @tailwind components;
    // @tailwind utilities;
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault(); 
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
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
    <main className="bg-[#004280] flex items-center justify-center min-h-screen">
      {/* Container */}
      <div className="text-center w-full max-w-[811px] p-4">
        {/* Logo */}
        <div className="mb-8">
          {/* Garanta que o arquivo logo.png esteja na pasta /public do seu projeto frontend */}
          <img src="/logo.png" alt="HTH Logo" className="mx-auto h-auto w-auto max-w-[472px] max-h-[293px]" />
        </div>

        {/* Login Box */}
        <div className="bg-[#002448] rounded-[50px] border-2 border-white p-4 text-white shadow-lg flex flex-col justify-center min-h-[430px] max-w-[650px] mx-auto sm:p-8">
          <form onSubmit={handleSubmit} className="w-full max-w-[400px] mx-auto text-center">
            {/* Email */}
            <div className="mb-4 text-left">
              <label htmlFor="email">Email:</label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full mt-1 rounded border-2 border-white bg-white px-3 text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 h-[73px]"
              />
            </div>

            {/* Password */}
            <div className="mb-6 text-left">
              <label htmlFor="password">Password:</label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full mt-1 rounded border-2 border-white bg-white px-3 text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 h-[73px]"
              />
            </div>

            {error && (<div className="mb-4 rounded bg-red-900/50 p-3 text-center text-sm text-red-400">{error}</div>)}

            {/* Button */}
            <button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-2 rounded border border-white transition-colors disabled:bg-orange-800 disabled:cursor-not-allowed">
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-white mt-6 text-sm">CREATE BY: KAIKY REIS</p>
      </div>
    </main>
  );
}

export default LoginPage; 