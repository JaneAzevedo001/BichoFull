# BichoFull

Projeto fullstack com **React (Vite)** no frontend e **Node.js + Express** no backend, com comunicação via proxy.

---

## Tecnologias
- **Frontend:** React + Vite  
- **Backend:** Node.js + Express  
- **Proxy:** configurado no Vite para redirecionar chamadas `/api`  

---

## Estrutura
```
bichofull/
  backend/
    src/
    package.json
  src/
    package.json
  .gitignore
  README.md
```

---

## Configuração

1. Clone o repositório:
   ```bash
   git clone https://github.com/JaneAzevedo001/BichoFull.git
   cd bichofull
   ```

2. Instale as dependências:
   ```bash
   npm install --prefix src
   npm install --prefix backend
   ```

3. Configure variáveis de ambiente:
   - Crie um arquivo `.env` no **frontend**:
     ```
     VITE_API_URL=http://localhost:3000
     ```
   - Crie um arquivo `.env` no **backend**:
     ```
     PORT=3000
     ```

---

## Rodando o projeto

- **Separado**:
  ```bash
  npm run dev --prefix frontend   # inicia frontend em http://localhost:5173
  npm start --prefix backend      # inicia backend em http://localhost:3000
  ```

---

## 🔗 Teste da API
- Backend direto:  
  ```
  http://localhost:3000/api
  ```
  → retorna `{ "message": "Backend funcionando!" }`

- Frontend:  
  ```
  http://localhost:5173
  ```
  → exibe a mensagem do backend na tela.

---
