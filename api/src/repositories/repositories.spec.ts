import { drizzle } from "drizzle-orm/libsql/web";
import {
  usuarioTable,
  alunoTable,
  professorTable,
  matriculaTable,
  atividadeTable,
  alunoAtividadeTable,
  produtoTable,
  equipamentoTable,
  relatorioTable,
} from "../db/schema";

import { Usuario, Aluno, Professor, Matricula, Atividade, Produto, Equipamento, Relatorio } from "../entities";
import {
  UsuarioRepository,
  AlunoRepository,
  ProfessorRepository,
  MatriculaRepository,
  AtividadeRepository,
  ProdutoRepository,
  EquipamentoRepository,
  RelatorioRepository,
} from "./repositories";

// Inicializa a conexão com o banco de dados para testes
const db = drizzle({
  connection: {
    url: "http://127.0.0.1:8080",
  },
});

// Instâncias dos Repositórios
const usuarioRepository = new UsuarioRepository(db);
const alunoRepository = new AlunoRepository(db);
const professorRepository = new ProfessorRepository(db);
const matriculaRepository = new MatriculaRepository(db);
const atividadeRepository = new AtividadeRepository(db);
const produtoRepository = new ProdutoRepository(db);
const equipamentoRepository = new EquipamentoRepository(db);
const relatorioRepository = new RelatorioRepository(db);

describe("Repositórios CRUD", () => {
  // IDs gerados durante os testes
  let usuarioId: number;
  let alunoUsuarioId: number;
  let professorUsuarioId: number;
  let matriculaId: number;
  let atividadeId: number;
  let produtoId: number;
  let equipamentoId: number;
  let relatorioId: number;

  // Limpeza do banco de dados antes de todos os testes
  beforeAll(async () => {
    await db.delete(relatorioTable).run();
    await db.delete(equipamentoTable).run();
    await db.delete(produtoTable).run();
    await db.delete(atividadeTable).run();
    await db.delete(matriculaTable).run();
    await db.delete(professorTable).run();
    await db.delete(alunoTable).run();
    await db.delete(usuarioTable).run();
  });

  // Limpeza após todos os testes
  afterAll(async () => {
    await db.delete(relatorioTable).run();
    await db.delete(equipamentoTable).run();
    await db.delete(produtoTable).run();
    await db.delete(atividadeTable).run();
    await db.delete(matriculaTable).run();
    await db.delete(professorTable).run();
    await db.delete(alunoTable).run();
    await db.delete(usuarioTable).run();
  });

  /**
   * Testes para UsuarioRepository
   */
  describe("UsuarioRepository", () => {
    it("deve criar um novo usuário", async () => {
      const usuarioData = {
        nome: "Teste Usuário",
        telefone: "11999999999",
        email: "teste@usuario.com",
        rua: "Rua Teste",
        numero: "123",
        complemento: "Apto 1",
        bairro: "Bairro Teste",
        cidade: "Cidade Teste",
        estado: "ST",
        cep: "12345-678",
        pais: "Brasil",
      };

      const usuario = await usuarioRepository.create(usuarioData);
      expect(usuario).toBeInstanceOf(Usuario);
      expect(usuario.id).toBeDefined();
      expect(usuario.email).toBe(usuarioData.email);

      usuarioId = usuario.id;
    });

    it("deve obter um usuário por ID", async () => {
      const usuario = await usuarioRepository.getById(usuarioId);
      expect(usuario).not.toBeNull();
      expect(usuario).toBeInstanceOf(Usuario);
      expect(usuario?.id).toBe(usuarioId);
    });

    it("deve obter todos os usuários", async () => {
      const usuarios = await usuarioRepository.getAll();
      expect(Array.isArray(usuarios)).toBe(true);
      expect(usuarios.length).toBeGreaterThan(0);
      usuarios.forEach((usuario) => {
        expect(usuario).toBeInstanceOf(Usuario);
      });
    });

    it("deve atualizar um usuário", async () => {
      const novosDados = {
        nome: "Usuário Atualizado",
        telefone: "11888888888",
      };

      const usuarioAtualizado = await usuarioRepository.update(usuarioId, novosDados);
      expect(usuarioAtualizado).not.toBeNull();
      expect(usuarioAtualizado?.nome).toBe(novosDados.nome);
      expect(usuarioAtualizado?.telefone).toBe(novosDados.telefone);
    });

    it("deve deletar um usuário", async () => {
      const foiDeletado = await usuarioRepository.delete(usuarioId);
      expect(foiDeletado).toBe(true);

      const usuario = await usuarioRepository.getById(usuarioId);
      expect(usuario).toBeNull();
    });
  });

  /**
   * Testes para AlunoRepository
   */
  describe("AlunoRepository", () => {
    it("deve criar um novo aluno", async () => {
      const alunoData = {
        nome: "Aluno Teste",
        telefone: "11988888888",
        email: "aluno@teste.com",
        rua: "Rua Aluno",
        numero: "456",
        complemento: "Casa",
        bairro: "Bairro Aluno",
        cidade: "Cidade Aluno",
        estado: "AL",
        cep: "87654-321",
        pais: "Brasil",
        ativo: 1, // 1 para ativo
      };

      const aluno = await alunoRepository.create(alunoData);
      expect(aluno).toBeInstanceOf(Aluno);
      expect(aluno.id).toBeDefined();
      expect(aluno.ativo).toBe(true);

      alunoUsuarioId = aluno.id;
    });

    it("deve obter um aluno por usuarioId", async () => {
      const aluno = await alunoRepository.getByUsuarioId(alunoUsuarioId);
      expect(aluno).not.toBeNull();
      expect(aluno).toBeInstanceOf(Aluno);
      expect(aluno?.id).toBe(alunoUsuarioId);
      expect(aluno?.ativo).toBe(true);
    });

    it("deve obter todos os alunos", async () => {
      const alunos = await alunoRepository.getAll();
      expect(Array.isArray(alunos)).toBe(true);
      expect(alunos.length).toBeGreaterThan(0);
      alunos.forEach((aluno) => {
        expect(aluno).toBeInstanceOf(Aluno);
      });
    });

    it("deve atualizar um aluno", async () => {
      const novosDados = {
        ativo: 0, // 0 para inativo
        nome: "Aluno Atualizado",
      };

      const alunoAtualizado = await alunoRepository.update(alunoUsuarioId, novosDados);
      expect(alunoAtualizado).not.toBeNull();
      expect(alunoAtualizado?.ativo).toBe(false);
      expect(alunoAtualizado?.nome).toBe(novosDados.nome);
    });

    it("deve deletar um aluno", async () => {
      const foiDeletado = await alunoRepository.delete(alunoUsuarioId);
      expect(foiDeletado).toBe(true);

      const aluno = await alunoRepository.getByUsuarioId(alunoUsuarioId);
      expect(aluno).toBeNull();
    });
  });

  /**
   * Testes para ProfessorRepository
   */
  describe("ProfessorRepository", () => {
    it("deve criar um novo professor", async () => {
      const professorData = {
        nome: "Professor Teste",
        telefone: "11977777777",
        email: "professor@teste.com",
        rua: "Rua Professor",
        numero: "789",
        complemento: "Sala 2",
        bairro: "Bairro Professor",
        cidade: "Cidade Professor",
        estado: "PR",
        cep: "11223-445",
        pais: "Brasil",
        especialidade: "Matemática",
      };

      const professor = await professorRepository.create(professorData);
      expect(professor).toBeInstanceOf(Professor);
      expect(professor.id).toBeDefined();
      expect(professor.especialidade).toBe(professorData.especialidade);

      professorUsuarioId = professor.id;
    });

    it("deve obter um professor por usuarioId", async () => {
      const professor = await professorRepository.getByUsuarioId(professorUsuarioId);
      expect(professor).not.toBeNull();
      expect(professor).toBeInstanceOf(Professor);
      expect(professor?.id).toBe(professorUsuarioId);
      expect(professor?.especialidade).toBe("Matemática");
    });

    it("deve obter todos os professores", async () => {
      const professores = await professorRepository.getAll();
      expect(Array.isArray(professores)).toBe(true);
      expect(professores.length).toBeGreaterThan(0);
      professores.forEach((professor) => {
        expect(professor).toBeInstanceOf(Professor);
      });
    });

    it("deve atualizar um professor", async () => {
      const novosDados = {
        especialidade: "Física",
        nome: "Professor Atualizado",
      };

      const professorAtualizado = await professorRepository.update(professorUsuarioId, novosDados);
      expect(professorAtualizado).not.toBeNull();
      expect(professorAtualizado?.especialidade).toBe(novosDados.especialidade);
      expect(professorAtualizado?.nome).toBe(novosDados.nome);
    });

    it("deve deletar um professor", async () => {
      const foiDeletado = await professorRepository.delete(professorUsuarioId);
      expect(foiDeletado).toBe(true);

      const professor = await professorRepository.getByUsuarioId(professorUsuarioId);
      expect(professor).toBeNull();
    });
  });

  /**
   * Testes para MatriculaRepository
   */
  describe("MatriculaRepository", () => {
    it("deve criar uma nova matrícula", async () => {
      // Primeiro, crie um aluno para associar a matrícula
      const alunoData = {
        nome: "Aluno Matricula",
        telefone: "11966666666",
        email: "aluno.matricula@teste.com",
        rua: "Rua Matricula",
        numero: "101",
        complemento: "",
        bairro: "Bairro Matricula",
        cidade: "Cidade Matricula",
        estado: "CM",
        cep: "33445-556",
        pais: "Brasil",
        ativo: 1,
      };

      const aluno = await alunoRepository.create(alunoData);
      expect(aluno).toBeInstanceOf(Aluno);
      alunoUsuarioId = aluno.id;

      const matriculaData = {
        dataMatricula: "2024-01-01",
        alunoId: alunoUsuarioId,
      };

      const matricula = await matriculaRepository.create(matriculaData);
      expect(matricula).toBeInstanceOf(Matricula);
      expect(matricula.id).toBeDefined();
      expect(matricula.alunoId).toBe(alunoUsuarioId);

      matriculaId = matricula.id;
    });

    it("deve obter uma matrícula por ID", async () => {
      const matricula = await matriculaRepository.getById(matriculaId);
      expect(matricula).not.toBeNull();
      expect(matricula).toBeInstanceOf(Matricula);
      expect(matricula?.id).toBe(matriculaId);
    });

    it("deve obter todas as matrículas", async () => {
      const matriculas = await matriculaRepository.getAll();
      expect(Array.isArray(matriculas)).toBe(true);
      expect(matriculas.length).toBeGreaterThan(0);
      matriculas.forEach((matricula) => {
        expect(matricula).toBeInstanceOf(Matricula);
      });
    });

    it("deve atualizar uma matrícula", async () => {
      const novosDados = {
        dataCancelamento: "2024-02-01",
      };

      const matriculaAtualizada = await matriculaRepository.update(matriculaId, novosDados);
      expect(matriculaAtualizada).not.toBeNull();
      expect(matriculaAtualizada?.dataCancelamento.toISOString().split("T")[0]).toBe(novosDados.dataCancelamento);
    });

    it("deve deletar uma matrícula", async () => {
      const foiDeletado = await matriculaRepository.delete(matriculaId);
      expect(foiDeletado).toBe(true);

      const matricula = await matriculaRepository.getById(matriculaId);
      expect(matricula).toBeNull();
    });
  });

  /**
   * Testes para AtividadeRepository
   */
  describe("AtividadeRepository", () => {
    it("deve criar uma nova atividade", async () => {
      // Primeiro, crie um professor para associar à atividade
      const professorData = {
        nome: "Professor Atividade",
        telefone: "11955555555",
        email: "professor.atividade@teste.com",
        rua: "Rua Atividade",
        numero: "202",
        complemento: "",
        bairro: "Bairro Atividade",
        cidade: "Cidade Atividade",
        estado: "CA",
        cep: "55667-889",
        pais: "Brasil",
        especialidade: "Educação Física",
      };

      const professor = await professorRepository.create(professorData);
      expect(professor).toBeInstanceOf(Professor);
      professorUsuarioId = professor.id;

      const atividadeData = {
        nome: "Aula de Pilates",
        descricao: "Aula avançada de Pilates",
        horaInicio: "10:00",
        horaFim: "11:00",
        professorId: professorUsuarioId,
      };

      const atividade = await atividadeRepository.create(atividadeData);
      expect(atividade).toBeInstanceOf(Atividade);
      expect(atividade.id).toBeDefined();

      atividadeId = atividade.id;
    });

    it("deve obter uma atividade por ID", async () => {
      const atividade = await atividadeRepository.getById(atividadeId);
      expect(atividade).not.toBeNull();
      expect(atividade).toBeInstanceOf(Atividade);
      expect(atividade?.id).toBe(atividadeId);
    });

    it("deve obter todas as atividades", async () => {
      const atividades = await atividadeRepository.getAll();
      expect(Array.isArray(atividades)).toBe(true);
      expect(atividades.length).toBeGreaterThan(0);
      atividades.forEach((atividade) => {
        expect(atividade).toBeInstanceOf(Atividade);
      });
    });

    it("deve atualizar uma atividade", async () => {
      const novosDados = {
        descricao: "Aula intermediária de Pilates",
      };

      const atividadeAtualizada = await atividadeRepository.update(atividadeId, novosDados);
      expect(atividadeAtualizada).not.toBeNull();
      expect(atividadeAtualizada?.descricao).toBe(novosDados.descricao);
    });

    it("deve deletar uma atividade", async () => {
      const foiDeletado = await atividadeRepository.delete(atividadeId);
      expect(foiDeletado).toBe(true);

      const atividade = await atividadeRepository.getById(atividadeId);
      expect(atividade).toBeNull();
    });
  });

  /**
   * Testes para ProdutoRepository
   */
  describe("ProdutoRepository", () => {
    it("deve criar um novo produto", async () => {
      const produtoData = {
        nome: "Produto Teste",
        preco: 99.99,
        quantidadeEstoque: 50,
      };

      const produto = await produtoRepository.create(produtoData);
      expect(produto).toBeInstanceOf(Produto);
      expect(produto.id).toBeDefined();
      expect(produto.nome).toBe(produtoData.nome);

      produtoId = produto.id;
    });

    it("deve obter um produto por ID", async () => {
      const produto = await produtoRepository.getById(produtoId);
      expect(produto).not.toBeNull();
      expect(produto).toBeInstanceOf(Produto);
      expect(produto?.id).toBe(produtoId);
    });

    it("deve obter todos os produtos", async () => {
      const produtos = await produtoRepository.getAll();
      expect(Array.isArray(produtos)).toBe(true);
      expect(produtos.length).toBeGreaterThan(0);
      produtos.forEach((produto) => {
        expect(produto).toBeInstanceOf(Produto);
      });
    });

    it("deve atualizar um produto", async () => {
      const novosDados = {
        preco: 89.99,
        quantidadeEstoque: 60,
      };

      const produtoAtualizado = await produtoRepository.update(produtoId, novosDados);
      expect(produtoAtualizado).not.toBeNull();
      expect(produtoAtualizado?.preco).toBe(novosDados.preco);
      expect(produtoAtualizado?.quantidadeEstoque).toBe(novosDados.quantidadeEstoque);
    });

    it("deve deletar um produto", async () => {
      const foiDeletado = await produtoRepository.delete(produtoId);
      expect(foiDeletado).toBe(true);

      const produto = await produtoRepository.getById(produtoId);
      expect(produto).toBeNull();
    });
  });

  /**
   * Testes para EquipamentoRepository
   */
  describe("EquipamentoRepository", () => {
    it("deve criar um novo equipamento", async () => {
      const equipamentoData = {
        nome: "Equipamento Teste",
        tipo: "Cardio",
        dataAquisicao: "2023-06-15",
      };

      const equipamento = await equipamentoRepository.create(equipamentoData);
      expect(equipamento).toBeInstanceOf(Equipamento);
      expect(equipamento.id).toBeDefined();
      expect(equipamento.nome).toBe(equipamentoData.nome);

      equipamentoId = equipamento.id;
    });

    it("deve obter um equipamento por ID", async () => {
      const equipamento = await equipamentoRepository.getById(equipamentoId);
      expect(equipamento).not.toBeNull();
      expect(equipamento).toBeInstanceOf(Equipamento);
      expect(equipamento?.id).toBe(equipamentoId);
    });

    it("deve obter todos os equipamentos", async () => {
      const equipamentos = await equipamentoRepository.getAll();
      expect(Array.isArray(equipamentos)).toBe(true);
      expect(equipamentos.length).toBeGreaterThan(0);
      equipamentos.forEach((equipamento) => {
        expect(equipamento).toBeInstanceOf(Equipamento);
      });
    });

    it("deve atualizar um equipamento", async () => {
      const novosDados = {
        tipo: "Força",
      };

      const equipamentoAtualizado = await equipamentoRepository.update(equipamentoId, novosDados);
      expect(equipamentoAtualizado).not.toBeNull();
      expect(equipamentoAtualizado?.tipo).toBe(novosDados.tipo);
    });

    it("deve deletar um equipamento", async () => {
      const foiDeletado = await equipamentoRepository.delete(equipamentoId);
      expect(foiDeletado).toBe(true);

      const equipamento = await equipamentoRepository.getById(equipamentoId);
      expect(equipamento).toBeNull();
    });
  });

  /**
   * Testes para RelatorioRepository
   */
  describe("RelatorioRepository", () => {
    it("deve criar um novo relatório", async () => {
      const relatorioData = {
        tipo: "Manutenção",
        dataGeracao: "2024-04-01",
        equipamentoId: equipamentoId, // Supondo que equipamentoId foi criado anteriormente
        produtoId: null, // Opcional
      };

      const relatorio = await relatorioRepository.create(relatorioData);
      expect(relatorio).toBeInstanceOf(Relatorio);
      expect(relatorio.id).toBeDefined();
      expect(relatorio.tipo).toBe(relatorioData.tipo);

      relatorioId = relatorio.id;
    });

    it("deve obter um relatório por ID", async () => {
      const relatorio = await relatorioRepository.getById(relatorioId);
      expect(relatorio).not.toBeNull();
      expect(relatorio).toBeInstanceOf(Relatorio);
      expect(relatorio?.id).toBe(relatorioId);
    });

    it("deve obter todos os relatórios", async () => {
      const relatorios = await relatorioRepository.getAll();
      expect(Array.isArray(relatorios)).toBe(true);
      expect(relatorios.length).toBeGreaterThan(0);
      relatorios.forEach((relatorio) => {
        expect(relatorio).toBeInstanceOf(Relatorio);
      });
    });

    it("deve atualizar um relatório", async () => {
      const novosDados = {
        tipo: "Vendas",
        dataGeracao: "2024-05-01",
      };

      const relatorioAtualizado = await relatorioRepository.update(relatorioId, novosDados);
      expect(relatorioAtualizado).not.toBeNull();
      expect(relatorioAtualizado?.tipo).toBe(novosDados.tipo);
      expect(relatorioAtualizado?.dataGeracao.toISOString().split("T")[0]).toBe(novosDados.dataGeracao);
    });

    it("deve deletar um relatório", async () => {
      const foiDeletado = await relatorioRepository.delete(relatorioId);
      expect(foiDeletado).toBe(true);

      const relatorio = await relatorioRepository.getById(relatorioId);
      expect(relatorio).toBeNull();
    });
  });
});
