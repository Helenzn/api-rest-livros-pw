require("dotenv").config();

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error("Defina JWT_SECRET com pelo menos 32 caracteres no arquivo .env.");
}

const express = require("express");
const app = express();
const authRoutes = require("./routes/authRoutes");
const livroRoutes = require("./routes/livroRoutes");
const errorHandler = require("./middlewares/errorHandler");

app.use(express.json({ limit: "10kb" }));
app.use("/auth", authRoutes);
app.use("/livros", livroRoutes);
app.use(errorHandler);

const PORTA = process.env.PORT || 3000;
app.listen(PORTA, function () {
  console.log("API de Livros rodando em http://localhost:" + PORTA);
});
