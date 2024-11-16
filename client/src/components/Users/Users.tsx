import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import "./Users.css";

const Users = () => {
  const [alunos, setAlunos] = useState<any[]>([
    {
      matricula: "123",
      nome: "João Silva",
      dataNascimento: "03/02/2001",
      genero: "Masculino",
      telefone: "1234-5678",
      celular: "98765-4321",
      cidade: "São Paulo",
      uf: "SP",
      cep: "12345-678",
      rua: "Rua A",
      numero: "123",
      bairro: "Centro",
    },
    {
      matricula: "124",
      nome: "Maria Souza",
      dataNascimento: "03/02/2001",
      genero: "Feminino",
      telefone: "2345-6789",
      celular: "98765-4322",
      cidade: "Rio de Janeiro",
      uf: "RJ",
      cep: "23456-789",
      rua: "Rua B",
      numero: "456",
      bairro: "Zona Sul",
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAluno, setSelectedAluno] = useState<any>(null);
  const [newAluno, setNewAluno] = useState({
    matricula: "",
    nome: "",
    dataNascimento: "",
    genero: "",
    telefone: "",
    celular: "",
    cidade: "",
    uf: "",
    cep: "",
    rua: "",
    numero: "",
    bairro: "",
  });

  const formatDateForInput = (date: string) => {
    if (!date) return "";
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}`; // Formato adequado para o campo de input tipo "date"
  };

  const formatDateForSave = (date: string) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`; // Formato para salvar
  };

  // Função para abrir o modal com os dados do aluno selecionado
  const handleAlunoSelect = (aluno: any) => {
    setSelectedAluno(aluno);
    setShowModal(true);
  };

  // Função para fechar o modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAluno(null);
  };

  // Função para adicionar novo aluno
  const handleAddAluno = () => {
    setAlunos((prev) => [
      ...prev,
      { ...newAluno }, // Cria o novo aluno com todos os dados
    ]);
    setNewAluno({
      matricula: "",
      nome: "",
      dataNascimento: "",
      genero: "",
      telefone: "",
      celular: "",
      cidade: "",
      uf: "",
      cep: "",
      rua: "",
      numero: "",
      bairro: "",
    });
  };

  // Função para editar os dados do aluno
  const handleEditAluno = () => {
    setAlunos((prev) =>
      prev.map((aluno) =>
        aluno.matricula === selectedAluno.matricula
          ? { ...selectedAluno }
          : aluno
      )
    );
    handleCloseModal();
  };

  // Função para remover um aluno
  const handleRemoveAluno = () => {
    setAlunos((prev) =>
      prev.filter((aluno) => aluno.matricula !== selectedAluno.matricula)
    );
    handleCloseModal();
  };

  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      {/* Listagem de Alunos */}
      <div style={{ flex: 1 }}>
        <h3>Lista de Alunos</h3>
        <table className="table table-striped table-dark">
          <thead>
            <tr>
              <th>Matrícula</th>
              <th>Nome</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {alunos.map((aluno) => (
              <tr key={aluno.matricula}>
                <td>{aluno.matricula}</td>
                <td>{aluno.nome}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => handleAlunoSelect(aluno)}
                  >
                    Editar/Remover
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Formulário de Cadastro de Aluno */}
      <div
        className="form-register-container"
        style={{ flex: 1, backgroundColor: "#101625", padding: "20px" }}
      >
        <h3>Cadastrar novo aluno</h3>
        <Form style={{ marginTop: "2rem" }}>
          <Form.Group className="mb-3" controlId="formMatricula">
            <Form.Label>Código de Matrícula</Form.Label>
            <Form.Control
              type="text"
              placeholder="Digite a matrícula"
              value={newAluno.matricula}
              onChange={(e) =>
                setNewAluno({ ...newAluno, matricula: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formNome">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              placeholder="Digite o nome"
              value={newAluno.nome}
              onChange={(e) =>
                setNewAluno({ ...newAluno, nome: e.target.value })
              }
            />
          </Form.Group>

          <div className="form-row">
            <Form.Group className="mb-3" controlId="formDataNascimento">
              <Form.Label>Data de Nascimento</Form.Label>
              <Form.Control
                type="date"
                value={formatDateForInput(newAluno.dataNascimento)}
                onChange={(e) =>
                  setNewAluno({
                    ...newAluno,
                    dataNascimento: formatDateForSave(e.target.value),
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formGenero">
              <Form.Label>Gênero</Form.Label>
              <Form.Control
                as="select"
                value={newAluno.genero}
                onChange={(e) =>
                  setNewAluno({ ...newAluno, genero: e.target.value })
                }
              >
                <option value="">Selecione o gênero</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outro">Outro</option>
              </Form.Control>
            </Form.Group>
          </div>
          <div className="form-row">
            <Form.Group className="mb-3" controlId="formTelefone">
              <Form.Label>Telefone</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o telefone"
                value={newAluno.telefone}
                onChange={(e) =>
                  setNewAluno({ ...newAluno, telefone: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formCelular">
              <Form.Label>Celular</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o celular"
                value={newAluno.celular}
                onChange={(e) =>
                  setNewAluno({ ...newAluno, celular: e.target.value })
                }
              />
            </Form.Group>
          </div>

          <div className="form-row-address">
            <Form.Group className="mb-3" controlId="formCidade">
              <Form.Label>Cidade</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite a cidade"
                value={newAluno.cidade}
                onChange={(e) =>
                  setNewAluno({ ...newAluno, cidade: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formUF">
              <Form.Label>UF</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o UF"
                value={newAluno.uf}
                onChange={(e) =>
                  setNewAluno({ ...newAluno, uf: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formCep">
              <Form.Label>CEP</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o CEP"
                value={newAluno.cep}
                onChange={(e) =>
                  setNewAluno({ ...newAluno, cep: e.target.value })
                }
              />
            </Form.Group>
          </div>

          <div className="form-row-address">
            <Form.Group
              className="mb-3"
              style={{ flex: "3" }}
              controlId="formRua"
            >
              <Form.Label>Rua</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite a rua"
                value={newAluno.rua}
                onChange={(e) =>
                  setNewAluno({ ...newAluno, rua: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              style={{ flex: "1" }}
              controlId="formNumero"
            >
              <Form.Label>Número</Form.Label>
              <Form.Control
                type="text"
                value={newAluno.numero}
                onChange={(e) =>
                  setNewAluno({ ...newAluno, numero: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              style={{ flex: "2" }}
              controlId="formBairro"
            >
              <Form.Label>Bairro</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o bairro"
                value={newAluno.bairro}
                onChange={(e) =>
                  setNewAluno({ ...newAluno, bairro: e.target.value })
                }
              />
            </Form.Group>
          </div>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "flex-end",
              marginTop: "3rem",
            }}
          >
            <Button
              variant="outline-light"
              onClick={() =>
                setNewAluno({
                  matricula: "",
                  nome: "",
                  dataNascimento: "",
                  genero: "",
                  telefone: "",
                  celular: "",
                  cidade: "",
                  uf: "",
                  cep: "",
                  rua: "",
                  numero: "",
                  bairro: "",
                })
              }
            >
              Limpar
            </Button>
            <Button variant="primary" onClick={handleAddAluno}>
              Cadastrar
            </Button>
          </div>
        </Form>
      </div>

      {/* Modal para Editar/Remover Aluno */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header
          closeButton
          style={{ backgroundColor: "rgb(16, 22, 37)", color: "white" }}
        >
          <Modal.Title>
            {selectedAluno ? `Editar: ${selectedAluno.nome}` : "Novo Aluno"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{ backgroundColor: "rgb(16, 22, 37)", color: "white" }}
        >
          <Form>
            <Form.Group className="mb-3" controlId="formMatricula">
              <Form.Label>Código de Matrícula</Form.Label>
              <Form.Control
                type="text"
                value={selectedAluno?.matricula || ""}
                onChange={(e) =>
                  setSelectedAluno({
                    ...selectedAluno,
                    matricula: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formNome">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                value={selectedAluno?.nome || ""}
                onChange={(e) =>
                  setSelectedAluno({ ...selectedAluno, nome: e.target.value })
                }
              />
            </Form.Group>

            <div className="form-row" style={{ gap: "2rem" }}>
              <Form.Group className="mb-3" controlId="formDataNascimento">
                <Form.Label>Data de Nascimento</Form.Label>
                <Form.Control
                  type="date"
                  value={formatDateForInput(
                    selectedAluno?.dataNascimento || ""
                  )}
                  onChange={(e) =>
                    setSelectedAluno({
                      ...selectedAluno,
                      dataNascimento: formatDateForSave(e.target.value),
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formGenero">
                <Form.Label>Gênero</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedAluno?.genero || ""}
                  onChange={(e) =>
                    setSelectedAluno({
                      ...selectedAluno,
                      genero: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </div>

            <div className="form-row" style={{ gap: "3rem" }}>
              <Form.Group className="mb-3" controlId="formTelefone">
                <Form.Label>Telefone</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedAluno?.telefone || ""}
                  onChange={(e) =>
                    setSelectedAluno({
                      ...selectedAluno,
                      telefone: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formCelular">
                <Form.Label>Celular</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedAluno?.celular || ""}
                  onChange={(e) =>
                    setSelectedAluno({
                      ...selectedAluno,
                      celular: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </div>

            <div className="form-row-address">
              <Form.Group className="mb-3" controlId="formCidade">
                <Form.Label>Cidade</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedAluno?.cidade || ""}
                  onChange={(e) =>
                    setSelectedAluno({
                      ...selectedAluno,
                      cidade: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formUF">
                <Form.Label>UF</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedAluno?.uf || ""}
                  onChange={(e) =>
                    setSelectedAluno({ ...selectedAluno, uf: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formCep">
                <Form.Label>CEP</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedAluno?.cep || ""}
                  onChange={(e) =>
                    setSelectedAluno({ ...selectedAluno, cep: e.target.value })
                  }
                />
              </Form.Group>
            </div>

            <div className="form-row-address">
              <Form.Group
                className="mb-3"
                controlId="formRua"
                style={{ flex: "3" }}
              >
                <Form.Label>Rua</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedAluno?.rua || ""}
                  onChange={(e) =>
                    setSelectedAluno({ ...selectedAluno, rua: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="formNumero"
                style={{ flex: "1" }}
              >
                <Form.Label>Número</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedAluno?.numero || ""}
                  onChange={(e) =>
                    setSelectedAluno({
                      ...selectedAluno,
                      numero: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="formBairro"
                style={{ flex: "2" }}
              >
                <Form.Label>Bairro</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedAluno?.bairro || ""}
                  onChange={(e) =>
                    setSelectedAluno({
                      ...selectedAluno,
                      bairro: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer
          style={{ backgroundColor: "rgb(16, 22, 37)", color: "white" }}
        >
          <Button variant="danger" onClick={handleRemoveAluno}>
            Remover Aluno
          </Button>
          <Button variant="primary" onClick={handleEditAluno}>
            Salvar Alterações
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Users;
