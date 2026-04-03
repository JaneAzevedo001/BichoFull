// src/controllers/userController.js
import User from "../models/User.js";
import  {hashPassword, comparePassword}  from "../utils/hashpassword.js";

// Atualizar dados do usuário
export const updateUser = async (req, res) => {
  try {
    const { full_name, email } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    user.full_name = full_name;
    user.email = email;
    await user.save();

    res.json({
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
    res.status(500).json({ error: "Erro ao atualizar usuário", details: err.message });
  }
};

// Atualizar senha do usuário
export const updatePassword = async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    if (!password || password.trim() === "") {
      return res.status(400).json({ error: "Senha inválida" });
    }

    user.password_hash = await hashPassword(password);
    await user.save();

    res.json({ message: "Senha atualizada com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar senha", details: err.message });
  }
};