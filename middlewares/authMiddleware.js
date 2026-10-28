const jwt = require("jsonwebtoken");
const revokedTokens = new Set();

function extractBearerToken(req) {
  const authorization = req.headers.authorization;
  if (!authorization) return null;
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

function authenticateToken(req, res, next) {
  const token = extractBearerToken(req);
  if (!token) {
    return res.status(401).json({ mensagem: "Token de autenticação não fornecido." });
  }
  if (revokedTokens.has(token)) {
    return res.status(401).json({ mensagem: "Token revogado. Faça login novamente." });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
    req.authToken = token;
    return next();
  } catch (erro) {
    const mensagem = erro.name === "TokenExpiredError"
      ? "Token expirado. Faça login novamente."
      : "Token inválido.";
    return res.status(401).json({ mensagem });
  }
}

function revokeToken(token) {
  revokedTokens.add(token);
}

// Tokens expirados já são rejeitados pelo JWT; removê-los evita crescimento sem limite.
const cleanupTimer = setInterval(() => {
  for (const token of revokedTokens) {
    try {
      jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
    } catch (erro) {
      revokedTokens.delete(token);
    }
  }
}, 15 * 60 * 1000);
if (cleanupTimer.unref) cleanupTimer.unref();

module.exports = { authenticateToken, revokeToken, extractBearerToken };
