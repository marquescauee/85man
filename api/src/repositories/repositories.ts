import { eq } from "drizzle-orm";
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

import {
  Usuario,
  Aluno,
  Professor,
  Matricula,
  Atividade,
  Produto,
  Equipamento,
  Relatorio,
} from "../entities";
import { LibSQLDatabase } from "drizzle-orm/libsql/driver-core";

// Repositório para Usuário
export class UsuarioRepository {
  constructor(db: LibSQLDatabase) {
    db = db;
  }

  // Create
  async create(
    usuarioData: typeof usuarioTable.$inferInsert
  ): Promise<Usuario> {
    const [newUsuarioData] = await db
      .insert(usuarioTable)
      .values(usuarioData)
      .returning();
    return new Usuario(
      newUsuarioData.id,
      newUsuarioData.nome,
      newUsuarioData.telefone || "",
      newUsuarioData.email,
      newUsuarioData.genero || "",
      newUsuarioData.dataNascimento || "",
      newUsuarioData.celular || "",
      newUsuarioData.rua || "",
      newUsuarioData.numero || "",
      newUsuarioData.complemento || "",
      newUsuarioData.bairro || "",
      newUsuarioData.cidade || "",
      newUsuarioData.estado || "",
      newUsuarioData.cep || "",
      newUsuarioData.pais || ""
    );
  }

  // Read by ID
  async getById(id: number): Promise<Usuario | null> {
    const result = await db
      .select()
      .from(usuarioTable)
      .where(eq(usuarioTable.id, id))
      .limit(1)
      .then((res) => res[0]);
    if (result) {
      return new Usuario(
        result.id,
        result.nome,
        result.telefone || "",
        result.email,
        result.rua || "",
        result.numero || "",
        result.complemento || "",
        result.bairro || "",
        result.cidade || "",
        result.estado || "",
        result.cep || "",
        result.pais || ""
      );
    }
    return null;
  }

  // Read All
  async getAll(): Promise<Usuario[]> {
    const results = await db.select().from(usuarioTable).all();
    return results.map(
      (data) =>
        new Usuario(
          data.id,
          data.nome,
          data.telefone || "",
          data.email,
          data.rua || "",
          data.numero || "",
          data.complemento || "",
          data.bairro || "",
          data.cidade || "",
          data.estado || "",
          data.cep || "",
          data.pais || ""
        )
    );
  }

  // Update
  async update(
    id: number,
    usuarioData: Partial<typeof usuarioTable.$inferInsert>
  ): Promise<Usuario | null> {
    await db
      .update(usuarioTable)
      .set(usuarioData)
      .where(eq(usuarioTable.id, id))
      .run();
    return this.getById(id);
  }

  // Delete
  async delete(id: number): Promise<boolean> {
    const result = await db
      .delete(usuarioTable)
      .where(eq(usuarioTable.id, id))
      .run();
    return result.rowsAffected > 0;
  }
}

// Repositório para Aluno
export class AlunoRepository {
  private usuarioRepo;

  constructor(db: LibSQLDatabase) {
    db = db;
    this.usuarioRepo = new UsuarioRepository(db);
  }

  // Create
  async create(
    alunoData: typeof alunoTable.$inferInsert & typeof usuarioTable.$inferInsert
  ): Promise<Aluno> {
    // Cria o usuário primeiro
    const usuario = await this.usuarioRepo.create(alunoData);

    // Cria o aluno vinculando ao usuário
    const alunoInsertData = {
      usuarioId: usuario.id,
      ativo: alunoData.ativo,
    };
    const [newAlunoData] = await db
      .insert(alunoTable)
      .values(alunoInsertData)
      .returning();

    return new Aluno(
      usuario.id,
      usuario.nome,
      usuario.telefone,
      usuario.email,
      usuario.rua,
      usuario.numero,
      usuario.complemento,
      usuario.bairro,
      usuario.cidade,
      usuario.estado,
      usuario.cep,
      usuario.pais,
      newAlunoData.ativo === 1 // Converte para booleano
    );
  }

  // Read by usuarioId
  async getByUsuarioId(usuarioId: number): Promise<Aluno | null> {
    const usuario = await this.usuarioRepo.getById(usuarioId);
    if (!usuario) return null;

    const alunoData = await db
      .select()
      .from(alunoTable)
      .where(eq(alunoTable.usuarioId, usuarioId))
      .limit(1)
      .then((res) => res[0]);
    if (alunoData) {
      return new Aluno(
        usuario.id,
        usuario.nome,
        usuario.telefone,
        usuario.email,
        usuario.rua,
        usuario.numero,
        usuario.complemento,
        usuario.bairro,
        usuario.cidade,
        usuario.estado,
        usuario.cep,
        usuario.pais,
        alunoData.ativo === 1 // Converte para booleano
      );
    }
    return null;
  }

  // Read All
  async getAll(): Promise<Aluno[]> {
    try {
      const alunosData = await db.select().from(alunoTable).all();
      const alunos: Aluno[] = [];
      for (const alunoRow of alunosData) {
        const usuario = await this.usuarioRepo.getById(alunoRow.usuarioId);
        if (usuario) {
          alunos.push(
            new Aluno(
              usuario.id,
              usuario.nome,
              usuario.telefone,
              usuario.email,
              usuario.rua,
              usuario.numero,
              usuario.complemento,
              usuario.bairro,
              usuario.cidade,
              usuario.estado,
              usuario.cep,
              usuario.pais,
              alunoRow.ativo === 1 // Converte para booleano
            )
          );
        }
      }
      return alunos;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  // Update
  async update(
    usuarioId: number,
    alunoData: Partial<typeof alunoTable.$inferInsert> &
      Partial<typeof usuarioTable.$inferInsert>
  ): Promise<Aluno | null> {
    // Atualiza o usuário
    await this.usuarioRepo.update(usuarioId, alunoData);

    // Atualiza o aluno
    await db
      .update(alunoTable)
      .set(alunoData)
      .where(eq(alunoTable.usuarioId, usuarioId))
      .run();

    return this.getByUsuarioId(usuarioId);
  }

  // Delete
  async delete(usuarioId: number): Promise<boolean> {
    // Deleta o aluno
    const deletedAluno = await db
      .delete(alunoTable)
      .where(eq(alunoTable.usuarioId, usuarioId))
      .run();

    // Deleta o usuário
    const deletedUsuario = await this.usuarioRepo.delete(usuarioId);

    return deletedAluno.rowsAffected > 0 && deletedUsuario;
  }
}

// Repositório para Professor
export class ProfessorRepository {
  private usuarioRepo;

  constructor(db: LibSQLDatabase) {
    db = db;
    this.usuarioRepo = new UsuarioRepository(db);
  }

  // Create
  async create(
    professorData: typeof professorTable.$inferInsert &
      typeof usuarioTable.$inferInsert
  ): Promise<Professor> {
    // Cria o usuário primeiro
    const usuario = await this.usuarioRepo.create(professorData);

    // Cria o professor vinculando ao usuário
    const professorInsertData = {
      usuarioId: usuario.id,
      especialidade: professorData.especialidade,
    };
    const [newProfessorData] = await db
      .insert(professorTable)
      .values(professorInsertData)
      .returning();

    return new Professor(
      usuario.id,
      usuario.nome,
      usuario.telefone,
      usuario.email,
      usuario.rua,
      usuario.numero,
      usuario.complemento,
      usuario.bairro,
      usuario.cidade,
      usuario.estado,
      usuario.cep,
      usuario.pais,
      newProfessorData.especialidade
    );
  }

  // Read by usuarioId
  async getByUsuarioId(usuarioId: number): Promise<Professor | null> {
    const usuario = await this.usuarioRepo.getById(usuarioId);
    if (!usuario) return null;

    const professorData = await db
      .select()
      .from(professorTable)
      .where(eq(professorTable.usuarioId, usuarioId))
      .limit(1)
      .then((res) => res[0]);
    if (professorData) {
      return new Professor(
        usuario.id,
        usuario.nome,
        usuario.telefone,
        usuario.email,
        usuario.rua,
        usuario.numero,
        usuario.complemento,
        usuario.bairro,
        usuario.cidade,
        usuario.estado,
        usuario.cep,
        usuario.pais,
        professorData.especialidade
      );
    }
    return null;
  }

  // Read All
  async getAll(): Promise<Professor[]> {
    const professoresData = await db.select().from(professorTable).all();
    const professores: Professor[] = [];
    for (const professorRow of professoresData) {
      const usuario = await this.usuarioRepo.getById(professorRow.usuarioId);
      if (usuario) {
        professores.push(
          new Professor(
            usuario.id,
            usuario.nome,
            usuario.telefone,
            usuario.email,
            usuario.rua,
            usuario.numero,
            usuario.complemento,
            usuario.bairro,
            usuario.cidade,
            usuario.estado,
            usuario.cep,
            usuario.pais,
            professorRow.especialidade
          )
        );
      }
    }
    return professores;
  }

  // Update
  async update(
    usuarioId: number,
    professorData: Partial<typeof professorTable.$inferInsert> &
      Partial<typeof usuarioTable.$inferInsert>
  ): Promise<Professor | null> {
    // Atualiza o usuário
    await this.usuarioRepo.update(usuarioId, professorData);

    // Atualiza o professor
    await db
      .update(professorTable)
      .set(professorData)
      .where(eq(professorTable.usuarioId, usuarioId))
      .run();

    return this.getByUsuarioId(usuarioId);
  }

  // Delete
  async delete(usuarioId: number): Promise<boolean> {
    // Deleta o professor
    const deletedProfessor = await db
      .delete(professorTable)
      .where(eq(professorTable.usuarioId, usuarioId))
      .run();

    // Deleta o usuário
    const deletedUsuario = await this.usuarioRepo.delete(usuarioId);

    return deletedProfessor.rowsAffected > 0 && deletedUsuario;
  }
}

// Repositório para Matrícula
export class MatriculaRepository {
  constructor(db: LibSQLDatabase) {
    db = db;
  }

  // Create
  async create(
    matriculaData: typeof matriculaTable.$inferInsert
  ): Promise<Matricula> {
    const [newMatriculaData] = await db
      .insert(matriculaTable)
      .values(matriculaData)
      .returning();
    return new Matricula(
      newMatriculaData.id,
      new Date(newMatriculaData.dataMatricula),
      newMatriculaData.dataCancelamento
        ? new Date(newMatriculaData.dataCancelamento)
        : new Date(),
      newMatriculaData.alunoId
    );
  }

  // Read by ID
  async getById(id: number): Promise<Matricula | null> {
    const result = await db
      .select()
      .from(matriculaTable)
      .where(eq(matriculaTable.id, id))
      .limit(1)
      .then((res) => res[0]);
    if (result) {
      return new Matricula(
        result.id,
        new Date(result.dataMatricula),
        result.dataCancelamento
          ? new Date(result.dataCancelamento)
          : new Date(),
        result.alunoId
      );
    }
    return null;
  }

  // Read All
  async getAll(): Promise<Matricula[]> {
    const results = await db.select().from(matriculaTable).all();
    return results.map(
      (data) =>
        new Matricula(
          data.id,
          new Date(data.dataMatricula),
          data.dataCancelamento ? new Date(data.dataCancelamento) : new Date(),
          data.alunoId
        )
    );
  }

  // Update
  async update(
    id: number,
    matriculaData: Partial<typeof matriculaTable.$inferInsert>
  ): Promise<Matricula | null> {
    await db
      .update(matriculaTable)
      .set(matriculaData)
      .where(eq(matriculaTable.id, id))
      .run();
    return this.getById(id);
  }

  // Delete
  async delete(id: number): Promise<boolean> {
    const result = await db
      .delete(matriculaTable)
      .where(eq(matriculaTable.id, id))
      .run();
    return result.rowsAffected > 0;
  }
}

// Repositório para Atividade
export class AtividadeRepository {
  constructor(db: LibSQLDatabase) {
    db = db;
  }

  // Create
  async create(
    atividadeData: typeof atividadeTable.$inferInsert
  ): Promise<Atividade> {
    const [newAtividadeData] = await db
      .insert(atividadeTable)
      .values(atividadeData)
      .returning();
    return new Atividade(
      newAtividadeData.id,
      newAtividadeData.nome,
      newAtividadeData.descricao ?? "",
      newAtividadeData.horaInicio
        ? new Date(`1970-01-01T${newAtividadeData.horaInicio}:00Z`)
        : new Date(),
      newAtividadeData.horaFim
        ? new Date(`1970-01-01T${newAtividadeData.horaFim}:00Z`)
        : new Date()
    );
  }

  // Read by ID
  async getById(id: number): Promise<Atividade | null> {
    const result = await db
      .select()
      .from(atividadeTable)
      .where(eq(atividadeTable.id, id))
      .limit(1)
      .then((res) => res[0]);
    if (result) {
      return new Atividade(
        result.id,
        result.nome,
        result.descricao ?? "",
        result.horaInicio
          ? new Date(`1970-01-01T${result.horaInicio}:00Z`)
          : new Date(),
        result.horaFim
          ? new Date(`1970-01-01T${result.horaFim}:00Z`)
          : new Date()
      );
    }
    return null;
  }

  // Read All
  async getAll(): Promise<Atividade[]> {
    const results = await db.select().from(atividadeTable).all();
    return results.map(
      (data) =>
        new Atividade(
          data.id,
          data.nome,
          data.descricao ?? "",
          data.horaInicio
            ? new Date(`1970-01-01T${data.horaInicio}:00Z`)
            : new Date(),
          data.horaFim ? new Date(`1970-01-01T${data.horaFim}:00Z`) : new Date()
        )
    );
  }

  // Update
  async update(
    id: number,
    atividadeData: Partial<typeof atividadeTable.$inferInsert>
  ): Promise<Atividade | null> {
    await db
      .update(atividadeTable)
      .set(atividadeData)
      .where(eq(atividadeTable.id, id))
      .run();
    return this.getById(id);
  }

  // Delete
  async delete(id: number): Promise<boolean> {
    const result = await db
      .delete(atividadeTable)
      .where(eq(atividadeTable.id, id))
      .run();
    return result.rowsAffected > 0;
  }
}

// // Repositório para AlunoAtividade
// export class AlunoAtividadeRepository {
//   // Create
//   async create(alunoAtividadeData: typeof alunoAtividadeTable.$inferInsert): Promise<AlunoAtividade | null> {
//     const [newAlunoAtividadeData] = await db.insert(alunoAtividadeTable).values(alunoAtividadeData).returning();
//     if (newAlunoAtividadeData) {
//       return {
//         primary_key: newAlunoAtividadeData.primaryKey,
//         alunoId: newAlunoAtividadeData.alunoId,
//         atividadeId: newAlunoAtividadeData.atividadeId,
//       };
//     }
//     return null;
//   }

//   // Read by Primary Key
//   async getByPrimaryKey(primaryKey: number): Promise<AlunoAtividade | null> {
//     const result = await db.select().from(alunoAtividadeTable).where(eq(alunoAtividadeTable.primaryKey, primaryKey)).limit(1).then(res => res[0]);
//     if (result) {
//       return {
//         primary_key: result.primaryKey,
//         alunoId: result.alunoId,
//         atividadeId: result.atividadeId,
//       };
//     }
//     return null;
//   }

//   // Read All
//   async getAll(): Promise<AlunoAtividade[]> {
//     const results = await db.select().from(alunoAtividadeTable).all();
//     return results.map(data => ({
//       primary_key: data.primaryKey,
//       alunoId: data.alunoId,
//       atividadeId: data.atividadeId,
//     }));
//   }

//   // Update
//   async update(primaryKey: number, alunoAtividadeData: Partial<typeof alunoAtividadeTable.$inferInsert>): Promise<AlunoAtividade | null> {
//     await db.update(alunoAtividadeTable).set(alunoAtividadeData).where(eq(alunoAtividadeTable.primaryKey, primaryKey)).run();
//     return this.getByPrimaryKey(primaryKey);
//   }

//   // Delete
//   async delete(primaryKey: number): Promise<boolean> {
//     const result = await db.delete(alunoAtividadeTable).where(eq(alunoAtividadeTable.primaryKey, primaryKey)).run();
//     return result > 0;
//   }
// }

// Repositório para Produto
export class ProdutoRepository {
  constructor(db: LibSQLDatabase) {
    db = db;
  }

  // Create
  async create(
    produtoData: typeof produtoTable.$inferInsert
  ): Promise<Produto> {
    const [newProdutoData] = await db
      .insert(produtoTable)
      .values(produtoData)
      .returning();
    return new Produto(
      newProdutoData.id,
      newProdutoData.nome,
      newProdutoData.preco,
      newProdutoData.quantidadeEstoque
    );
  }

  // Read by ID
  async getById(id: number): Promise<Produto | null> {
    const result = await db
      .select()
      .from(produtoTable)
      .where(eq(produtoTable.id, id))
      .limit(1)
      .then((res) => res[0]);
    if (result) {
      return new Produto(
        result.id,
        result.nome,
        result.preco,
        result.quantidadeEstoque
      );
    }
    return null;
  }

  // Read All
  async getAll(): Promise<Produto[]> {
    const results = await db.select().from(produtoTable).all();
    return results.map(
      (data) =>
        new Produto(data.id, data.nome, data.preco, data.quantidadeEstoque)
    );
  }

  // Update
  async update(
    id: number,
    produtoData: Partial<typeof produtoTable.$inferInsert>
  ): Promise<Produto | null> {
    await db
      .update(produtoTable)
      .set(produtoData)
      .where(eq(produtoTable.id, id))
      .run();
    return this.getById(id);
  }

  // Delete
  async delete(id: number): Promise<boolean> {
    const result = await db
      .delete(produtoTable)
      .where(eq(produtoTable.id, id))
      .run();
    return result.rowsAffected > 0;
  }
}

// Repositório para Equipamento
export class EquipamentoRepository {
  constructor(db: LibSQLDatabase) {
    db = db;
  }

  // Create
  async create(
    equipamentoData: typeof equipamentoTable.$inferInsert
  ): Promise<Equipamento> {
    const [newEquipamentoData] = await db
      .insert(equipamentoTable)
      .values(equipamentoData)
      .returning();
    return new Equipamento(
      newEquipamentoData.id,
      newEquipamentoData.nome,
      newEquipamentoData.tipo || "",
      newEquipamentoData.dataAquisicao
        ? new Date(equipamentoData.dataAquisicao as string)
        : new Date()
    );
  }

  // Read by ID
  async getById(id: number): Promise<Equipamento | null> {
    const result = await db
      .select()
      .from(equipamentoTable)
      .where(eq(equipamentoTable.id, id))
      .limit(1)
      .then((res) => res[0]);
    if (result) {
      return new Equipamento(
        result.id,
        result.nome,
        result.tipo || "",
        result.dataAquisicao ? new Date(result.dataAquisicao) : new Date()
      );
    }
    return null;
  }

  // Read All
  async getAll(): Promise<Equipamento[]> {
    const results = await db.select().from(equipamentoTable).all();
    return results.map(
      (data) =>
        new Equipamento(
          data.id,
          data.nome,
          data.tipo || "",
          data.dataAquisicao ? new Date(data.dataAquisicao) : new Date()
        )
    );
  }

  // Update
  async update(
    id: number,
    equipamentoData: Partial<typeof equipamentoTable.$inferInsert>
  ): Promise<Equipamento | null> {
    await db
      .update(equipamentoTable)
      .set(equipamentoData)
      .where(eq(equipamentoTable.id, id))
      .run();
    return this.getById(id);
  }

  // Delete
  async delete(id: number): Promise<boolean> {
    const result = await db
      .delete(equipamentoTable)
      .where(eq(equipamentoTable.id, id))
      .run();
    return result.rowsAffected > 0;
  }
}

// Repositório para Relatório
export class RelatorioRepository {
  constructor(db: LibSQLDatabase) {
    db = db;
  }

  // Create
  async create(
    relatorioData: typeof relatorioTable.$inferInsert
  ): Promise<Relatorio> {
    const [newRelatorioData] = await db
      .insert(relatorioTable)
      .values(relatorioData)
      .returning();
    return new Relatorio(
      newRelatorioData.id,
      newRelatorioData.tipo || "",
      newRelatorioData.dataGeracao
        ? new Date(relatorioData.dataGeracao as string)
        : new Date()
    );
  }

  // Read by ID
  async getById(id: number): Promise<Relatorio | null> {
    const result = await db
      .select()
      .from(relatorioTable)
      .where(eq(relatorioTable.id, id))
      .limit(1)
      .then((res) => res[0]);
    if (result) {
      return new Relatorio(
        result.id,
        result.tipo || "",
        result.dataGeracao ? new Date(result.dataGeracao) : new Date()
      );
    }
    return null;
  }

  // Read All
  async getAll(): Promise<Relatorio[]> {
    const results = await db.select().from(relatorioTable).all();
    return results.map(
      (data) =>
        new Relatorio(
          data.id,
          data.tipo || "",
          data.dataGeracao ? new Date(data.dataGeracao) : new Date()
        )
    );
  }

  // Update
  async update(
    id: number,
    relatorioData: Partial<typeof relatorioTable.$inferInsert>
  ): Promise<Relatorio | null> {
    await db
      .update(relatorioTable)
      .set(relatorioData)
      .where(eq(relatorioTable.id, id))
      .run();
    return this.getById(id);
  }

  // Delete
  async delete(id: number): Promise<boolean> {
    const result = await db
      .delete(relatorioTable)
      .where(eq(relatorioTable.id, id))
      .run();
    return result.rowsAffected > 0;
  }
}

import { db } from "../index";

export const usuarioRepository = new UsuarioRepository(db);
export const alunoRepository = new AlunoRepository(db);
export const professorRepository = new ProfessorRepository(db);
export const matriculaRepository = new MatriculaRepository(db);
export const atividadeRepository = new AtividadeRepository(db);
// export const alunoAtividadeRepository = new AlunoAtividadeRepository();
export const produtoRepository = new ProdutoRepository(db);
export const equipamentoRepository = new EquipamentoRepository(db);
export const relatorioRepository = new RelatorioRepository(db);
