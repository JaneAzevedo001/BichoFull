import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // usa variável de ambiente ou 3000 como padrão
//rota simples
app.get('/api', (req, res) => {
  res.json({ message: 'Backend funcionando!' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
