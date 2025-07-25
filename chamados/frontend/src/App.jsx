function App() {
  return (
    // Container principal que centraliza tudo na tela e dá um fundo escuro
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
      
      {/* O card do formulário */}
      <div className="w-full max-w-md rounded-lg bg-slate-800 p-8 shadow-lg">
        
        {/* Título do formulário */}
        <h2 className="mb-6 text-center text-3xl font-bold text-emerald-400">
          Acessar Sistema
        </h2>

        {/* Formulário */}
        <form>
          {/* Campo de Email */}
          <div className="mb-4">
            <label 
              htmlFor="email" 
              className="mb-2 block text-sm font-bold text-slate-300"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="seuemail@exemplo.com"
              className="w-full rounded bg-slate-700 p-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Campo de Senha */}
          <div className="mb-6">
            <label 
              htmlFor="password" 
              className="mb-2 block text-sm font-bold text-slate-300"
            >
              Senha
            </label>
            <input
              type="password"
              id="password"
              placeholder="********"
              className="w-full rounded bg-slate-700 p-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Botão de Entrar */}
          <button
            type="submit"
            className="w-full rounded bg-emerald-600 py-2 font-bold text-white transition duration-300 hover:bg-emerald-700"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;