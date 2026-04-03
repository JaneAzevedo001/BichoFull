// src/controllers/authController.js
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Validação simples de e-mail
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const register = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    // Validações básicas
    if (!full_name || !email || !password) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "E-mail inválido" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Senha muito curta" });
    }

    // Verifica e-mail duplicado
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Este e-mail já está em uso" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ full_name, email, password_hash });

    // Retorna apenas dados seguros
    const { id, created_at } = newUser;
    res.status(201).json({ 
      message: "Usuário registrado com sucesso", 
      user: { id, full_name, email, created_at } 
    });

  } catch (err) {
    console.error("Erro no registro:", err);
    res.status(500).json({ error: "Erro interno ao registrar usuário" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "E-mail e senha são obrigatórios" });
    }

    const user = await User.findOne({ where: { email } });
    
    // Mesma mensagem para usuário não encontrado OU senha incorreta
    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { 
        expiresIn: "1h",
        algorithm: "HS256" 
      }
    );

    res.json({ 
      message: "Login realizado com sucesso", 
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        balance: user.balance,
        created_at: user.created_at
      }
    });

  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ error: "Erro interno ao fazer login" });
  }
};

export const me = async (req, res) => {
  try {
    //EXCLUI password_hash da resposta
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password_hash"] }
    });
    
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    
    res.json(user);
  } catch (err) {
    console.error("Erro ao buscar usuário:", err);
    res.status(500).json({ error: "Erro ao buscar dados do usuário" });
  }
};