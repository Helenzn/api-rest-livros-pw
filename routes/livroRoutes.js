const express = require("express");
const router = express.Router();
const livroController = require("../controllers/livroController");
const { authenticateToken } = require("../middlewares/authMiddleware");

// Todas as operações de livros exigem um JWT válido.
router.use(authenticateToken);
router.get("/", livroController.listar);
router.get("/:id/resumo", livroController.buscarResumo);
router.get("/:id", livroController.buscarPorId);
router.post("/", livroController.criar);
router.put("/:id", livroController.atualizar);
router.delete("/:id", livroController.remover);

module.exports = router;
