# Sistema de Chamados

Rodar backend:
```bash
cd backend
npm install
npm run dev
```

Rodar frontend:
```bash
cd frontend
npm install
npm run dev
```



🚀 Sistema de Chamados para Eventos
Um sistema web completo para gerenciamento de chamados técnicos em tempo real, projetado para ser exibido em painéis (TVs) durante eventos, com controle de acesso baseado em função.

✅ Funcionalidades Principais
Autenticação Segura: Login com tokens JWT.

Controle de Acesso por Função:

ADMIN: Gerencia usuários e todos os chamados.

TECNICO: Atende aos chamados e atualiza seus status.

VISUALIZADOR: Apenas visualiza o painel.

Gerenciamento de Chamados (CRUD): Crie, visualize, atualize e delete chamados.

Painel em Tempo Real: Todas as ações (criação, atualização de status, exclusão) são refletidas instantaneamente para todos os usuários conectados via WebSockets (Socket.IO).

Sistema de Urgência Visual: Chamados abertos mudam de cor (verde, amarelo, vermelho) com base no tempo de espera.

Notificações Sonoras: Alertas sonoros são disparados quando um novo chamado é criado.

Modo TV: Uma rota /tv otimizada para exibição em telas grandes.

⚙️ Stack Tecnológica
Camada	Tecnologia
Frontend	React (Vite), Tailwind CSS, React Router, Socket.IO Client
Backend	Node.js, Express, Prisma (ORM), PostgreSQL
Autenticação	JWT (jsonwebtoken), bcryptjs
Tempo Real	Socket.IO

Exportar para as Planilhas
📦 Instalação e Configuração
Siga os passos abaixo para configurar e rodar o projeto em um ambiente de desenvolvimento.

Pré-requisitos
Node.js: Versão 18.x ou superior (recomenda-se a versão LTS).

NPM ou Yarn: Gerenciador de pacotes do Node.js.

PostgreSQL: Uma instância do banco de dados rodando localmente ou na nuvem.

Git: Para clonar o repositório.

Passo a Passo

1 - Clone o Repositório
git clone [URL_DO_SEU_REPOSITORIO]
cd [NOME_DA_PASTA_DO_PROJETO]

2- Configuração do Backend

Navegue até a pasta do backend: cd backend

Instale as dependências: npm install

Crie um arquivo de variáveis de ambiente chamado .env na raiz da pasta backend. Copie o conteúdo do arquivo .env.example (se existir) ou use o modelo abaixo:

# String de conexão do seu banco de dados PostgreSQL
DATABASE_URL="postgresql://USUARIO:SENHA@HOST:PORTA/NOME_DO_BANCO"

# Chave secreta para os tokens JWT (use um gerador de senhas seguras)
JWT_SECRET="SUA_CHAVE_SUPER_SECRETA_AQUI"


Execute as migrações do Prisma para criar as tabelas no seu banco de dados: npx prisma migrate dev

(Opcional, mas recomendado) Para criar um primeiro usuário ADMIN, você pode usar o Prisma Studio ou criar um script de "seed".

npx prisma studio


3 Configuração do Frontend

Em um novo terminal, navegue até a pasta do frontend: cd frontend


Instale as dependências: npm install


Com certeza! Criar uma boa documentação é um passo fundamental e muito profissional. Um arquivo README.md bem escrito é a porta de entrada do seu projeto.

Copie e cole o texto abaixo em um novo arquivo chamado README.md na pasta principal do seu projeto (HTH-PROGRAM-2.0/chamados/). O GitHub irá formatá-lo e exibi-lo lindamente na página do seu repositório.

🚀 Sistema de Chamados para Eventos
Um sistema web completo para gerenciamento de chamados técnicos em tempo real, projetado para ser exibido em painéis (TVs) durante eventos, com controle de acesso baseado em função.

✅ Funcionalidades Principais
Autenticação Segura: Login com tokens JWT.

Controle de Acesso por Função:

ADMIN: Gerencia usuários e todos os chamados.

TECNICO: Atende aos chamados e atualiza seus status.

VISUALIZADOR: Apenas visualiza o painel.

Gerenciamento de Chamados (CRUD): Crie, visualize, atualize e delete chamados.

Painel em Tempo Real: Todas as ações (criação, atualização de status, exclusão) são refletidas instantaneamente para todos os usuários conectados via WebSockets (Socket.IO).

Sistema de Urgência Visual: Chamados abertos mudam de cor (verde, amarelo, vermelho) com base no tempo de espera.

Notificações Sonoras: Alertas sonoros são disparados quando um novo chamado é criado.

Modo TV: Uma rota /tv otimizada para exibição em telas grandes.

⚙️ Stack Tecnológica
Camada	Tecnologia
Frontend	React (Vite), Tailwind CSS, React Router, Socket.IO Client
Backend	Node.js, Express, Prisma (ORM), PostgreSQL
Autenticação	JWT (jsonwebtoken), bcryptjs
Tempo Real	Socket.IO

Exportar para as Planilhas
📦 Instalação e Configuração
Siga os passos abaixo para configurar e rodar o projeto em um ambiente de desenvolvimento.

Pré-requisitos
Node.js: Versão 18.x ou superior (recomenda-se a versão LTS).

NPM ou Yarn: Gerenciador de pacotes do Node.js.

PostgreSQL: Uma instância do banco de dados rodando localmente ou na nuvem.

Git: Para clonar o repositório.

Passo a Passo
Clone o Repositório

Bash

git clone [URL_DO_SEU_REPOSITORIO]
cd [NOME_DA_PASTA_DO_PROJETO]
Configuração do Backend

Navegue até a pasta do backend:

Bash

cd backend
Instale as dependências:

Bash

npm install
Crie um arquivo de variáveis de ambiente chamado .env na raiz da pasta backend. Copie o conteúdo do arquivo .env.example (se existir) ou use o modelo abaixo:

Snippet de código

# String de conexão do seu banco de dados PostgreSQL
DATABASE_URL="postgresql://USUARIO:SENHA@HOST:PORTA/NOME_DO_BANCO"

# Chave secreta para os tokens JWT (use um gerador de senhas seguras)
JWT_SECRET="SUA_CHAVE_SUPER_SECRETA_AQUI"
Execute as migrações do Prisma para criar as tabelas no seu banco de dados:

Bash

npx prisma migrate dev
(Opcional, mas recomendado) Para criar um primeiro usuário ADMIN, você pode usar o Prisma Studio ou criar um script de "seed".

Bash

npx prisma studio
Configuração do Frontend

Em um novo terminal, navegue até a pasta do frontend:

Bash

cd frontend
Instale as dependências:

Bash

npm install


▶️ Como Rodar a Aplicação
Para rodar o projeto, você precisará de dois terminais abertos simultaneamente.

Terminal 1 (Backend)

Navegue até a pasta backend.

Inicie o servidor (ele irá reiniciar automaticamente com o nodemon se configurado): npm run dev 
# ou, se não tiver script 'dev': node src/index.js

O backend estará rodando em http://localhost:3001.

Terminal 2 (Frontend)

Navegue até a pasta frontend.

Inicie o servidor de desenvolvimento do Vite:

Bash

npm run dev
A aplicação estará acessível em http://localhost:5173.

Agora é só abrir o navegador no endereço do frontend e usar a aplicação!