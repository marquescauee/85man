import {
  alunoTable,
  atividadeTable,
  equipamentoTable,
  matriculaTable,
  produtoTable,
  professorTable,
  relatorioTable,
  usuarioTable,
} from "./db/schema";

export type UsuarioInsert = typeof usuarioTable.$inferInsert;
export type UsuarioSelect = typeof usuarioTable.$inferSelect;

export type AlunoInsert = typeof alunoTable.$inferInsert;
export type AlunoSelect = typeof alunoTable.$inferSelect;

export type ProfessorInsert = typeof professorTable.$inferInsert;
export type ProfessorSelect = typeof professorTable.$inferSelect;

export type MatriculaInsert = typeof matriculaTable.$inferInsert;
export type MatriculaSelect = typeof matriculaTable.$inferSelect;

export type AtividadeInsert = typeof atividadeTable.$inferInsert;
export type AtividadeSelect = typeof atividadeTable.$inferSelect;

export type ProdutoInsert = typeof produtoTable.$inferInsert;
export type ProdutoSelect = typeof produtoTable.$inferSelect;

export type EquipamentoInsert = typeof equipamentoTable.$inferInsert;
export type EquipamentoSelect = typeof equipamentoTable.$inferSelect;

export type RelatorioInsert = typeof relatorioTable.$inferInsert;
export type RelatorioSelect = typeof relatorioTable.$inferSelect;
