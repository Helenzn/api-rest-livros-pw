// routes/livroRoutes.js — Definição das rotas do recurso "Livros"

const express = require("express");
const router = express.Router();

const livroController = require("../controllers/livroController");

// Lista todos os livros
router.get("/", livroController.listar);

// Resumo de um livro (antes da rota genérica por ID)
router.get("/:id/resumo", livroController.buscarResumo);

// Busca um livro específico pelo identificador
router.get("/:id", livroController.buscarPorId);

// Cria um novo livro
router.post("/", livroController.criar);

// Atualiza um livro existente
router.put("/:id", livroController.atualizar);

// Remove um livro específico
router.delete("/:id", livroController.remover);

module.exports = router;
