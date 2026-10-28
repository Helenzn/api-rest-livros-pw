const bcrypt = require("bcrypt");

// Armazenamento demonstrativo em memória; será substituído por um banco em produção.
const users = new Map();
let nextUserId = 1;

async function createUser(email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  if (users.has(normalizedEmail)) return null;

  const passwordHash = await bcrypt.hash(password, 10);
  const user = { id: nextUserId++, email: normalizedEmail, passwordHash, role: "user" };
  users.set(normalizedEmail, user);
  return { id: user.id, email: user.email, role: user.role };
}

async function findUserByEmail(email) {
  if (typeof email !== "string") return null;
  return users.get(email.trim().toLowerCase()) || null;
}

module.exports = { createUser, findUserByEmail };
