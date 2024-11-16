import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  usuarioRepository,
  alunoRepository,
  professorRepository,
  produtoRepository,
  equipamentoRepository,
  relatorioRepository,
  matriculaRepository,
  atividadeRepository,
} from "./repositories/repositories";
import { drizzle } from "drizzle-orm/libsql/web";

dotenv.config();

export const db = drizzle({
  connection: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
});

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

app.use(cors());

// ----------------------
// Rotas CRUD para Usuários
// ----------------------

app.post("/usuarios", async (req: Request, res: Response) => {
  try {
    const usuario = await usuarioRepository.create(req.body);
    res.status(201).json(usuario);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar usuário", error });
  }
});

app.get("/usuarios", async (req: Request, res: Response) => {
  try {
    const usuarios = await usuarioRepository.getAll();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter usuários", error });
  }
});

app.get("/usuarios/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const usuario = await usuarioRepository.getById(id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter usuário", error });
  }
});

app.put("/usuarios/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const usuarioAtualizado = await usuarioRepository.update(id, req.body);
    if (!usuarioAtualizado) {
      return res
        .status(404)
        .json({ message: "Usuário não encontrado para atualização" });
    }
    res.status(200).json(usuarioAtualizado);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar usuário", error });
  }
});

app.delete("/usuarios/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const foiDeletado = await usuarioRepository.delete(id);
    if (!foiDeletado) {
      return res
        .status(404)
        .json({ message: "Usuário não encontrado para deleção" });
    }
    res.status(200).json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar usuário", error });
  }
});

// ----------------------
// Rotas CRUD para Alunos
// ----------------------

app.post("/alunos", async (req: Request, res: Response) => {
  try {
    const aluno = await alunoRepository.create(req.body);
    res.status(201).json(aluno);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar aluno", error });
  }
});

app.get("/alunos", async (req: Request, res: Response) => {
  try {
    const alunos = await alunoRepository.getAll();
    res.status(200).json(alunos);
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter alunos", error });
  }
});

app.get("/alunos/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const aluno = await alunoRepository.getByUsuarioId(id);
    if (!aluno) {
      return res.status(404).json({ message: "Aluno não encontrado" });
    }
    res.status(200).json(aluno);
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter aluno", error });
  }
});

app.put("/alunos/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const alunoAtualizado = await alunoRepository.update(id, req.body);
    if (!alunoAtualizado) {
      return res
        .status(404)
        .json({ message: "Aluno não encontrado para atualização" });
    }
    res.status(200).json(alunoAtualizado);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar aluno", error });
  }
});

app.delete("/alunos/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const foiDeletado = await alunoRepository.delete(id);
    if (!foiDeletado) {
      return res
        .status(404)
        .json({ message: "Aluno não encontrado para deleção" });
    }
    res.status(200).json({ message: "Aluno deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar aluno", error });
  }
});

// ----------------------
// Rotas CRUD para Professores
// ----------------------

app.post("/professores", async (req: Request, res: Response) => {
  try {
    const professor = await professorRepository.create(req.body);
    res.status(201).json(professor);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar professor", error });
  }
});

app.get("/professores", async (req: Request, res: Response) => {
  try {
    const professores = await professorRepository.getAll();
    res.status(200).json(professores);
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter professores", error });
  }
});

app.get("/professores/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const professor = await professorRepository.getByUsuarioId(id);
    if (!professor) {
      return res.status(404).json({ message: "Professor não encontrado" });
    }
    res.status(200).json(professor);
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter professor", error });
  }
});

app.put("/professores/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const professorAtualizado = await professorRepository.update(id, req.body);
    if (!professorAtualizado) {
      return res
        .status(404)
        .json({ message: "Professor não encontrado para atualização" });
    }
    res.status(200).json(professorAtualizado);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar professor", error });
  }
});

app.delete("/professores/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const foiDeletado = await professorRepository.delete(id);
    if (!foiDeletado) {
      return res
        .status(404)
        .json({ message: "Professor não encontrado para deleção" });
    }
    res.status(200).json({ message: "Professor deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar professor", error });
  }
});

// ----------------------
// Rotas CRUD para Produtos
// ----------------------

app.post("/produtos", async (req: Request, res: Response) => {
  try {
    const produto = await produtoRepository.create(req.body);
    res.status(201).json(produto);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar produto", error });
  }
});

app.get("/produtos", async (req: Request, res: Response) => {
  try {
    const produtos = await produtoRepository.getAll();
    res.status(200).json(produtos);
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter produtos", error });
  }
});

app.get("/produtos/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const produto = await produtoRepository.getById(id);
    if (!produto) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }
    res.status(200).json(produto);
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter produto", error });
  }
});

app.put("/produtos/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const produtoAtualizado = await produtoRepository.update(id, req.body);
    if (!produtoAtualizado) {
      return res
        .status(404)
        .json({ message: "Produto não encontrado para atualização" });
    }
    res.status(200).json(produtoAtualizado);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar produto", error });
  }
});

app.delete("/produtos/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const foiDeletado = await produtoRepository.delete(id);
    if (!foiDeletado) {
      return res
        .status(404)
        .json({ message: "Produto não encontrado para deleção" });
    }
    res.status(200).json({ message: "Produto deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar produto", error });
  }
});

// ----------------------
// Rotas CRUD para Equipamentos
// ----------------------

app.post("/equipamentos", async (req: Request, res: Response) => {
  try {
    const equipamento = await equipamentoRepository.create(req.body);
    res.status(201).json(equipamento);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar equipamento", error });
  }
});

app.get("/equipamentos", async (req: Request, res: Response) => {
  try {
    const equipamentos = await equipamentoRepository.getAll();
    res.status(200).json(equipamentos);
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter equipamentos", error });
  }
});

app.get("/equipamentos/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const equipamento = await equipamentoRepository.getById(id);
    if (!equipamento) {
      return res.status(404).json({ message: "Equipamento não encontrado" });
    }
    res.status(200).json(equipamento);
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter equipamento", error });
  }
});

app.put("/equipamentos/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const equipamentoAtualizado = await equipamentoRepository.update(
      id,
      req.body
    );
    if (!equipamentoAtualizado) {
      return res
        .status(404)
        .json({ message: "Equipamento não encontrado para atualização" });
    }
    res.status(200).json(equipamentoAtualizado);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar equipamento", error });
  }
});

app.delete("/equipamentos/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const foiDeletado = await equipamentoRepository.delete(id);
    if (!foiDeletado) {
      return res
        .status(404)
        .json({ message: "Equipamento não encontrado para deleção" });
    }
    res.status(200).json({ message: "Equipamento deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar equipamento", error });
  }
});

// ----------------------
// Rotas CRUD para Relatórios
// ----------------------

app.post("/relatorios", async (req: Request, res: Response) => {
  try {
    const relatorio = await relatorioRepository.create(req.body);
    res.status(201).json(relatorio);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar relatório", error });
  }
});

app.get("/relatorios", async (req: Request, res: Response) => {
  try {
    const relatorios = await relatorioRepository.getAll();
    res.status(200).json(relatorios);
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter relatórios", error });
  }
});

app.get("/relatorios/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const relatorio = await relatorioRepository.getById(id);
    if (!relatorio) {
      return res.status(404).json({ message: "Relatório não encontrado" });
    }
    res.status(200).json(relatorio);
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter relatório", error });
  }
});

app.put("/relatorios/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const relatorioAtualizado = await relatorioRepository.update(id, req.body);
    if (!relatorioAtualizado) {
      return res
        .status(404)
        .json({ message: "Relatório não encontrado para atualização" });
    }
    res.status(200).json(relatorioAtualizado);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar relatório", error });
  }
});

app.delete("/relatorios/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const foiDeletado = await relatorioRepository.delete(id);
    if (!foiDeletado) {
      return res
        .status(404)
        .json({ message: "Relatório não encontrado para deleção" });
    }
    res.status(200).json({ message: "Relatório deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar relatório", error });
  }
});

// ----------------------
// Rotas CRUD para Matrículas
// ----------------------

app.post("/matriculas", async (req: Request, res: Response) => {
  try {
    const matricula = await matriculaRepository.create(req.body);
    res.status(201).json(matricula);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar matrícula", error });
  }
});

app.get("/matriculas", async (req: Request, res: Response) => {
  try {
    const matriculas = await matriculaRepository.getAll();
    res.status(200).json(matriculas);
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter matrículas", error });
  }
});

app.get("/matriculas/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const matricula = await matriculaRepository.getById(id);
    if (!matricula) {
      return res.status(404).json({ message: "Matrícula não encontrada" });
    }
    res.status(200).json(matricula);
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter matrícula", error });
  }
});

app.put("/matriculas/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const matriculaAtualizada = await matriculaRepository.update(id, req.body);
    if (!matriculaAtualizada) {
      return res
        .status(404)
        .json({ message: "Matrícula não encontrada para atualização" });
    }
    res.status(200).json(matriculaAtualizada);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar matrícula", error });
  }
});

app.delete("/matriculas/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const foiDeletado = await matriculaRepository.delete(id);
    if (!foiDeletado) {
      return res
        .status(404)
        .json({ message: "Matrícula não encontrada para deleção" });
    }
    res.status(200).json({ message: "Matrícula deletada com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar matrícula", error });
  }
});

// ----------------------
// Rotas CRUD para Atividades
// ----------------------

app.post("/atividades", async (req: Request, res: Response) => {
  try {
    const atividade = await atividadeRepository.create(req.body);
    res.status(201).json(atividade);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar atividade", error });
  }
});

app.get("/atividades", async (req: Request, res: Response) => {
  try {
    const atividades = await atividadeRepository.getAll();
    res.status(200).json(atividades);
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter atividades", error });
  }
});

app.get("/atividades/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const atividade = await atividadeRepository.getById(id);
    if (!atividade) {
      return res.status(404).json({ message: "Atividade não encontrada" });
    }
    res.status(200).json(atividade);
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter atividade", error });
  }
});

app.put("/atividades/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const atividadeAtualizada = await atividadeRepository.update(id, req.body);
    if (!atividadeAtualizada) {
      return res
        .status(404)
        .json({ message: "Atividade não encontrada para atualização" });
    }
    res.status(200).json(atividadeAtualizada);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar atividade", error });
  }
});

app.delete("/atividades/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const foiDeletado = await atividadeRepository.delete(id);
    if (!foiDeletado) {
      return res
        .status(404)
        .json({ message: "Atividade não encontrada para deleção" });
    }
    res.status(200).json({ message: "Atividade deletada com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar atividade", error });
  }
});

// ----------------------
// Rota Padrão
// ----------------------

app.get("/", (req: Request, res: Response) => {
  res.send("API está funcionando!");
});

// ----------------------
// Middleware para Tratamento de Erros
// ----------------------

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Algo deu errado!", error: err.message });
});

// ----------------------
// Iniciando o Servidor
// ----------------------

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
