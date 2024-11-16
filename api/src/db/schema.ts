import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";

// Tabela Usuario
export const usuarioTable = sqliteTable("usuario", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nome: text("nome").notNull(),
  telefone: text("telefone"),
  email: text("email").notNull().unique(),
  rua: text("rua"),
  numero: text("numero"),
  complemento: text("complemento"),
  bairro: text("bairro"),
  cidade: text("cidade"),
  estado: text("estado"),
  cep: text("cep"),
  pais: text("pais"),
});

// Tabela Aluno
export const alunoTable = sqliteTable("aluno", {
  usuarioId: integer("usuario_id").primaryKey().references(() => usuarioTable.id),
  ativo: integer("ativo").notNull(),
});

// Tabela Professor
export const professorTable = sqliteTable("professor", {
  usuarioId: integer("usuario_id").primaryKey().references(() => usuarioTable.id),
  especialidade: text("especialidade").notNull(),
});

// Tabela Matricula
export const matriculaTable = sqliteTable("matricula", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  dataMatricula: text("data_matricula").notNull(),
  dataCancelamento: text("data_cancelamento"),
  alunoId: integer("aluno_id").notNull().references(() => alunoTable.usuarioId),
});

// Tabela Atividade
export const atividadeTable = sqliteTable("atividade", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nome: text("nome").notNull(),
  descricao: text("descricao"),
  horaInicio: text("hora_inicio"),
  horaFim: text("hora_fim"),
  professorId: integer("professor_id").notNull().references(() => professorTable.usuarioId),
});

// Tabela AlunoAtividade (Relacionamento entre Aluno e Atividade)
export const alunoAtividadeTable = sqliteTable("aluno_atividade", {
  primaryKey: integer("primary_key").primaryKey({ autoIncrement: true }),
  alunoId: integer("aluno_id").notNull().references(() => alunoTable.usuarioId),
  atividadeId: integer("atividade_id").notNull().references(() => atividadeTable.id),
});

// Tabela Produto
export const produtoTable = sqliteTable("produto", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nome: text("nome").notNull(),
  preco: real("preco").notNull(),
  quantidadeEstoque: integer("quantidade_estoque").notNull(),
});

// Tabela Equipamento
export const equipamentoTable = sqliteTable("equipamento", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nome: text("nome").notNull(),
  tipo: text("tipo"),
  dataAquisicao: text("data_aquisicao"),
});

// Tabela Relatorio
export const relatorioTable = sqliteTable("relatorio", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  tipo: text("tipo"),
  dataGeracao: text("data_geracao"),
  equipamentoId: integer("equipamento_id").references(() => equipamentoTable.id),
  produtoId: integer("produto_id").references(() => produtoTable.id),
});
