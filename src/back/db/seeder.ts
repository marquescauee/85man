// Importações necessárias
import {db} from '../../index';
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
} from './schema';

// Função assíncrona para popular a base de dados
export async function seedDatabase() {

    console.log('Populando a base de dados...');
  try {
    // Inserção de usuários
    const [usuario1] = await db
      .insert(usuarioTable)
      .values({
        nome: 'Ana Silva',
        telefone: '11987654321',
        email: 'ana.silva@example.com',
        rua: 'Rua das Flores',
        numero: '123',
        complemento: '',
        bairro: 'Jardim Primavera',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01000-000',
        pais: 'Brasil',
      })
      .returning({ id: usuarioTable.id });

    const [usuario2] = await db
      .insert(usuarioTable)
      .values({
        nome: 'Bruno Costa',
        telefone: '21912345678',
        email: 'bruno.costa@example.com',
        rua: 'Avenida Central',
        numero: '456',
        complemento: 'Apto 101',
        bairro: 'Centro',
        cidade: 'Rio de Janeiro',
        estado: 'RJ',
        cep: '20000-000',
        pais: 'Brasil',
      })
      .returning({ id: usuarioTable.id });

    const [usuario3] = await db
      .insert(usuarioTable)
      .values({
        nome: 'Carla Mendes',
        telefone: '31987654321',
        email: 'carla.mendes@example.com',
        rua: 'Rua dos Pinheiros',
        numero: '789',
        complemento: '',
        bairro: 'Savassi',
        cidade: 'Belo Horizonte',
        estado: 'MG',
        cep: '30100-000',
        pais: 'Brasil',
      })
      .returning({ id: usuarioTable.id });

    // Inserção de alunos
    await db.insert(alunoTable).values([
      {
        usuarioId: usuario1.id,
        ativo: 1, // 'ativo' agora é um inteiro (1 para ativo, 0 para inativo)
      },
      {
        usuarioId: usuario3.id,
        ativo: 1,
      },
    ]);

    // Inserção de professores
    await db.insert(professorTable).values({
      usuarioId: usuario2.id,
      especialidade: 'Educação Física',
    });

    // Inserção de matrículas
    const [matricula1] = await db
      .insert(matriculaTable)
      .values({
        dataMatricula: '2023-01-15', // Data como string
        alunoId: usuario1.id,
      })
      .returning({ id: matriculaTable.id });

    const [matricula2] = await db
      .insert(matriculaTable)
      .values({
        dataMatricula: '2023-02-20',
        alunoId: usuario3.id,
      })
      .returning({ id: matriculaTable.id });

    // Inserção de atividades
    const [atividade1] = await db
      .insert(atividadeTable)
      .values({
        nome: 'Aula de Yoga',
        descricao: 'Aula para iniciantes em Yoga',
        horaInicio: '08:00',
        horaFim: '09:00',
        professorId: usuario2.id,
      })
      .returning({ id: atividadeTable.id });

    const [atividade2] = await db
      .insert(atividadeTable)
      .values({
        nome: 'Treinamento Funcional',
        descricao: 'Exercícios de alta intensidade',
        horaInicio: '18:00',
        horaFim: '19:00',
        professorId: usuario2.id,
      })
      .returning({ id: atividadeTable.id });

    // Inserção na tabela de junção AlunoAtividade
    await db.insert(alunoAtividadeTable).values([
      {
        alunoId: usuario1.id,
        atividadeId: atividade1.id,
      },
      {
        alunoId: usuario3.id,
        atividadeId: atividade2.id,
      },
    ]);

    // Inserção de produtos
    const [produto1] = await db
      .insert(produtoTable)
      .values({
        nome: 'Camisa Esportiva',
        preco: 49.9,
        quantidadeEstoque: 100,
      })
      .returning({ id: produtoTable.id });

    const [produto2] = await db
      .insert(produtoTable)
      .values({
        nome: 'Garrafa Térmica',
        preco: 29.9,
        quantidadeEstoque: 50,
      })
      .returning({ id: produtoTable.id });

    // Inserção de equipamentos
    const [equipamento1] = await db
      .insert(equipamentoTable)
      .values({
        nome: 'Esteira',
        tipo: 'Cardio',
        dataAquisicao: '2022-05-10', // Data como string
      })
      .returning({ id: equipamentoTable.id });

    const [equipamento2] = await db
      .insert(equipamentoTable)
      .values({
        nome: 'Bicicleta Ergométrica',
        tipo: 'Cardio',
        dataAquisicao: '2022-06-15',
      })
      .returning({ id: equipamentoTable.id });

    // Inserção de relatórios
    await db.insert(relatorioTable).values([
      {
        tipo: 'Manutenção',
        dataGeracao: new Date().toISOString().split('T')[0], // Data atual como string
        equipamentoId: equipamento1.id,
      },
      {
        tipo: 'Vendas',
        dataGeracao: new Date().toISOString().split('T')[0],
        produtoId: produto1.id,
      },
    ]);

    console.log('Base de dados populada com sucesso!');
  } catch (error) {
    console.error('Erro ao popular a base de dados:', error);
  }
}