# BichoFull 🐾

Bem-vindo ao **BichoFull**, um simulador do Jogo do Bicho com saldo fictício.  
O objetivo é **aprender a mecânica das apostas** e se divertir sem riscos financeiros.

---

## Tecnologias utilizadas
- Node.js + Express (API backend)
- Sequelize (ORM para MySQL)
- React + Vite (frontend)
- JWT (autenticação)
- MySQL (banco de dados)
- Gerenciamento de pacotes: npm

---
## Configuração do ambiente

1. Clone o repositório:
   ```bash
   git clone https://github.com/JaneAzevedo001/BichoFull.git

2. Entre na pasta do repositório:
   ```bash
   cd caminho\para\BichoFull

3. Crie o arquivo .env no backend:
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=sua_senha
   DB_NAME=bicho_full
   JWT_SECRET=seu_segredo

4. Instale dependências:
 ```bash
npm install

5. Configure o banco de dados MySQL:
Crie o banco bicho_full: Use o arquivo disponível: 
   "BichoFull\backend\src\database\schema.sql"
Popule o banco com os 25 animais:
execute: "npm run seed:animals"

6. Executar
BichoFull\Backend: npm run start
   A API ficará disponível em http://localhost:3000.
BichoFull\src:  npm run dev
   O frontend ficará disponível em http://localhost:5173.
