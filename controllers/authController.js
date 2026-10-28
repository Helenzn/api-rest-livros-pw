const jwt = require("jsonwebtoken");
const { createUser, findUserByEmail } = require("../services/userService");
const { revokeToken } = require("../middlewares/authMiddleware");

async function register(req, res, next) {
  try {
    const { email, password } = req.body || {};
    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        typeof password !== "string" || password.length < 8) {
      return res.status(400).json({ mensagem: "Informe um email válido e uma senha com pelo menos 8 caracteres." });
    }

    const user = await createUser(email, password);
    if (!user) return res.status(409).json({ mensagem: "Não foi possível criar a conta com esses dados." });
    return res.status(201).json({ id: user.id, email: user.email });
  } catch (erro) {
    return next(erro);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};
    if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
      return res.status(400).json({ mensagem: "Email e senha são obrigatórios." });
    }

    const user = await findUserByEmail(email);
    const senhaValida = user ? await require("bcrypt").compare(password, user.passwordHash) : false;
    if (!senhaValida) return res.status(401).json({ mensagem: "Credenciais inválidas." });

    const token = jwt.sign(
      { sub: String(user.id), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h", algorithm: "HS256" }
    );
    return res.status(200).json({ token, tokenType: "Bearer", expiresIn: process.env.JWT_EXPIRES_IN || "1h" });
  } catch (erro) {
    return next(erro);
  }
}

function logout(req, res) {
  revokeToken(req.authToken);
  return res.status(200).json({ mensagem: "Logout realizado com sucesso." });
}

module.exports = { register, login, logout };
