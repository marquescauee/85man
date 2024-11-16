// Classe Usuario
export class Usuario {
    id: number;
    nome: string;
    telefone: string;
    email: string;
    rua: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    pais: string;

    constructor(
        id: number,
        nome: string,
        telefone: string,
        email: string,
        rua: string,
        numero: string,
        complemento: string,
        bairro: string,
        cidade: string,
        estado: string,
        cep: string,
        pais: string
    ) {
        this.id = id;
        this.nome = nome;
        this.telefone = telefone;
        this.email = email;
        this.rua = rua;
        this.numero = numero;
        this.complemento = complemento;
        this.bairro = bairro;
        this.cidade = cidade;
        this.estado = estado;
        this.cep = cep;
        this.pais = pais;
    }
}

// Classe Aluno
export class Aluno extends Usuario {
    ativo: boolean;

    constructor(
        id: number,
        nome: string,
        telefone: string,
        email: string,
        rua: string,
        numero: string,
        complemento: string,
        bairro: string,
        cidade: string,
        estado: string,
        cep: string,
        pais: string,
        ativo: boolean
    ) {
        super(id, nome, telefone, email, rua, numero, complemento, bairro, cidade, estado, cep, pais);
        this.ativo = ativo;
    }

    matricular(): void {
        // Implementação do método matricular
    }

    cancelarMatricula(): void {
        // Implementação do método cancelarMatricula
    }
}

// Classe Professor
export class Professor extends Usuario {
    especialidade: string;

    constructor(
        id: number,
        nome: string,
        telefone: string,
        email: string,
        rua: string,
        numero: string,
        complemento: string,
        bairro: string,
        cidade: string,
        estado: string,
        cep: string,
        pais: string,
        especialidade: string
    ) {
        super(id, nome, telefone, email, rua, numero, complemento, bairro, cidade, estado, cep, pais);
        this.especialidade = especialidade;
    }

    agendarAula(): void {
        // Implementação do método agendarAula
    }

    cancelarAula(): void {
        // Implementação do método cancelarAula
    }
}

// Classe Matricula
export class Matricula {
    id: number;
    dataMatricula: Date;
    dataCancelamento: Date;
    alunoId: number;

    constructor(
        id: number,
        dataMatricula: Date,
        dataCancelamento: Date,
        alunoId: number
    ) {
        this.id = id;
        this.dataMatricula = dataMatricula;
        this.dataCancelamento = dataCancelamento;
        this.alunoId = alunoId;
    }

    registrar(): void {
        // Implementação do método registrar
    }

    cancelar(): void {
        // Implementação do método cancelar
    }
}

// Classe Atividade
export class Atividade {
    id: number;
    nome: string;
    descricao: string;
    horaInicio: Date;
    horaFim: Date;

    constructor(
        id: number,
        nome: string,
        descricao: string,
        horaInicio: Date,
        horaFim: Date
    ) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.horaInicio = horaInicio;
        this.horaFim = horaFim;
    }

    agendar(): void {
        // Implementação do método agendar
    }

    cancelar(): void {
        // Implementação do método cancelar
    }
}

// Classe Produto
export class Produto {
    id: number;
    nome: string;
    preco: number;
    quantidadeEstoque: number;

    constructor(
        id: number,
        nome: string,
        preco: number,
        quantidadeEstoque: number
    ) {
        this.id = id;
        this.nome = nome;
        this.preco = preco;
        this.quantidadeEstoque = quantidadeEstoque;
    }

    vender(): void {
        // Implementação do método vender
    }

    atualizarEstoque(): void {
        // Implementação do método atualizarEstoque
    }
}

// Classe Equipamento
export class Equipamento {
    id: number;
    nome: string;
    tipo: string;
    dataAquisicao: Date;

    constructor(
        id: number,
        nome: string,
        tipo: string,
        dataAquisicao: Date
    ) {
        this.id = id;
        this.nome = nome;
        this.tipo = tipo;
        this.dataAquisicao = dataAquisicao;
    }

    registrarManutencao(): void {
        // Implementação do método registrarManutencao
    }

    atualizarStatus(): void {
        // Implementação do método atualizarStatus
    }
}

// Classe Relatorio
export class Relatorio {
    id: number;
    tipo: string;
    dataGeracao: Date;

    constructor(id: number, tipo: string, dataGeracao: Date) {
        this.id = id;
        this.tipo = tipo;
        this.dataGeracao = dataGeracao;
    }

    gerarRelatorio(): void {
        // Implementação do método gerarRelatorio
    }
}
