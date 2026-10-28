// controllers/livroController.js — Orquestração das requisições de Livros

const livroService = require("../services/livroService");

function listar(req, res, next) {
  try {
    const livros = livroService.buscarTodos();
    return res.status(200).json(livros);
  } catch (erro) {
    return next(erro);
  }
}

function buscarPorId(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const livro = livroService.buscarPorId(id);

    if (!livro) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Livro com id " + id + " não encontrado",
      });
    }

    return res.status(200).json(livro);
  } catch (erro) {
    return next(erro);
  }
}

function criar(req, res, next) {
  try {
    const dados = req.body;

    if (!dados.titulo || !dados.autor || dados.preco === undefined) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Os campos 'titulo', 'autor' e 'preco' são obrigatórios",
      });
    }

    const novoLivro = livroService.criar(dados);
    return res.status(201).json(novoLivro);
  } catch (erro) {
    return next(erro);
  }
}

function atualizar(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const dados = req.body;
    const livroAtualizado = livroService.atualizar(id, dados);

    if (!livroAtualizado) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Livro com id " + id + " não encontrado para atualização",
      });
    }

    return res.status(200).json(livroAtualizado);
  } catch (erro) {
    return next(erro);
  }
}

function remover(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const livroRemovido = livroService.remover(id);

    if (!livroRemovido) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Livro com id " + id + " não encontrado para remoção",
      });
    }

    return res.status(200).json(livroRemovido);
  } catch (erro) {
    return next(erro);
  }
}

function buscarResumo(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const livro = livroService.buscarPorId(id);

    if (!livro) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Livro com id " + id + " não encontrado",
      });
    }

    return res.status(200).json({
      titulo: livro.titulo,
      autor: livro.autor,
      preco: livro.preco,
    });
  } catch (erro) {
    return next(erro);
  }
}

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizar,
  remover,
  buscarResumo,
};
