CREATE TABLE `aluno_atividade` (
	`primary_key` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`aluno_id` integer NOT NULL,
	`atividade_id` integer NOT NULL,
	FOREIGN KEY (`aluno_id`) REFERENCES `aluno`(`usuario_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`atividade_id`) REFERENCES `atividade`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `aluno` (
	`usuario_id` integer PRIMARY KEY NOT NULL,
	`ativo` integer NOT NULL,
	FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `atividade` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nome` text NOT NULL,
	`descricao` text,
	`hora_inicio` text,
	`hora_fim` text,
	`professor_id` integer NOT NULL,
	FOREIGN KEY (`professor_id`) REFERENCES `professor`(`usuario_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `equipamento` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nome` text NOT NULL,
	`tipo` text,
	`data_aquisicao` text
);
--> statement-breakpoint
CREATE TABLE `matricula` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`data_matricula` text NOT NULL,
	`data_cancelamento` text,
	`aluno_id` integer NOT NULL,
	FOREIGN KEY (`aluno_id`) REFERENCES `aluno`(`usuario_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `produto` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nome` text NOT NULL,
	`preco` real NOT NULL,
	`quantidade_estoque` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `professor` (
	`usuario_id` integer PRIMARY KEY NOT NULL,
	`especialidade` text NOT NULL,
	FOREIGN KEY (`usuario_id`) REFERENCES `usuario`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `relatorio` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tipo` text,
	`data_geracao` text,
	`equipamento_id` integer,
	`produto_id` integer,
	FOREIGN KEY (`equipamento_id`) REFERENCES `equipamento`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`produto_id`) REFERENCES `produto`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `usuario` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nome` text NOT NULL,
	`telefone` text,
	`email` text NOT NULL,
	`rua` text,
	`numero` text,
	`complemento` text,
	`bairro` text,
	`cidade` text,
	`estado` text,
	`cep` text,
	`pais` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `usuario_email_unique` ON `usuario` (`email`);