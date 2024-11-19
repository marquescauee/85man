import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { ProfessorInsert, UsuarioInsert } from "../../../../api/src/types";
import { jsPDF } from "jspdf";

export interface Professor {
  id: number;
  nome: string;
  telefone: string;
  genero: string;
  dataNascimento: string;
  celular: string;
  email: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  pais: string;
  especialidade: string;
}

interface ProfissionaisProps {
  professionalsData: Professor[];
}

const Profissionais = ({ professionalsData }: ProfissionaisProps) => {
  const [professores, setProfessores] =
    useState<Professor[]>(professionalsData);
  const [showModal, setShowModal] = useState(false);
  const [selectedProfessor, setSelectedProfessor] = useState<any>(null);
  const [newProfessor, setNewProfessor] = useState({
    id: 0,
    nome: "",
    especialidade: "",
    telefone: "",
    genero: "",
    dataNascimento: "",
    celular: "",
    email: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
    pais: "",
  } as Professor);

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

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");

    // Título
    doc.setFontSize(18);
    doc.text("Relatório de Professores Cadastrados", 14, 20);

    // Cabeçalhos das colunas
    doc.setFontSize(12);
    doc.text("ID", 14, 30);
    doc.text("Nome", 40, 30);
    doc.text("Especialidade", 100, 30);
    doc.text("Telefone", 160, 30);
    doc.text("Gênero", 210, 30);
    doc.text("Data Nascimento", 250, 30);
    doc.text("Celular", 280, 30);
    doc.text("Email", 320, 30);
    doc.text("Rua", 360, 30);
    doc.text("Número", 400, 30);
    doc.text("Complemento", 440, 30);
    doc.text("Bairro", 480, 30);
    doc.text("Cidade", 520, 30);
    doc.text("Estado", 560, 30);
    doc.text("CEP", 600, 30);
    doc.text("País", 640, 30);

    const maxLinesPerPage = 25; // Número máximo de linhas por página
    let yOffset = 40; // Posição inicial no eixo Y

    // Iterar sobre os professores cadastrados
    professionalsData.forEach((professor, index) => {
      // Verificar se a página está cheia
      if (index > 0 && index % maxLinesPerPage === 0) {
        doc.addPage(); // Adiciona uma nova página
        yOffset = 20; // Redefine o yOffset após adicionar uma nova página
      }

      // Adiciona os dados do professor
      doc.text(String(professor.id), 14, yOffset);
      doc.text(professor.nome, 40, yOffset);
      doc.text(professor.especialidade, 100, yOffset);
      doc.text(professor.telefone, 160, yOffset);
      doc.text(professor.genero, 210, yOffset);
      doc.text(professor.dataNascimento, 250, yOffset);
      doc.text(professor.celular, 280, yOffset);
      doc.text(professor.email, 320, yOffset);
      doc.text(professor.rua, 360, yOffset);
      doc.text(professor.numero, 400, yOffset);
      doc.text(professor.complemento, 440, yOffset);
      doc.text(professor.bairro, 480, yOffset);
      doc.text(professor.cidade, 520, yOffset);
      doc.text(professor.estado, 560, yOffset);
      doc.text(professor.cep, 600, yOffset);
      doc.text(professor.pais, 640, yOffset);

      // Atualiza o yOffset para a próxima linha
      yOffset += 10;
    });

    // Salvando o PDF
    doc.save("relatorio_professores.pdf");
  };

  // Função para abrir o modal com os dados do professor selecionado
  const handleProfessorSelect = (professor: any) => {
    setSelectedProfessor(professor);
    setShowModal(true);
  };

  // Função para fechar o modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProfessor(null);
  };

  // Função para adicionar novo professor
  const handleAddProfessor = async () => {
    const professor: ProfessorInsert = {
      especialidade: "",
    };

    const usuario: UsuarioInsert = newProfessor;

    const response = await fetch("http://localhost:3000/professores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        professor,
        usuario,
      }),
    });

    const newUser = await response.json();

    setProfessores((prev) => [...prev, { ...newUser }]);

    const maxId = Math.floor(100000 + Math.random() * 900000);

    setNewProfessor({
      id: maxId,
      nome: "",
      especialidade: "",
      telefone: "",
      genero: "",
      dataNascimento: "",
      celular: "",
      email: "",
      rua: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
      pais: "",
    });
  };

  // Função para editar os dados do professor
  const handleEditProfessor = async () => {
    const professor: ProfessorInsert = {
      especialidade: selectedProfessor.especialidade,
    };

    const usuario: UsuarioInsert = selectedProfessor;

    const response = await fetch(
      `http://localhost:3000/professores/${selectedProfessor.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          professor,
          usuario,
        }),
      }
    );

    const updatedProfessor = await response.json();

    setProfessores((prev) =>
      prev.map((professor) =>
        professor.id === selectedProfessor.id
          ? { ...updatedProfessor }
          : professor
      )
    );
    handleCloseModal();
  };

  // Função para remover um professor
  const handleRemoveProfessor = async () => {
    const professor: ProfessorInsert = {
      especialidade: selectedProfessor.especialidade,
    };

    const usuario: UsuarioInsert = selectedProfessor;

    await fetch(`http://localhost:3000/professores/${selectedProfessor.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        professor,
        usuario,
      }),
    });

    setProfessores((prev) =>
      prev.filter((professor) => professor.id !== selectedProfessor.id)
    );
    handleCloseModal();
  };

  //   useEffect(() => {
  //     const handleProfessor = async () => {
  //       try {
  //         const response = await fetch("http://localhost:3000/professores");

  //         if (!response.ok) {
  //           throw new Error(`Erro ao buscar Professores: ${response.statusText}`);
  //         }

  //         const professores: any[] = await response.json();
  //         setProfessores(professores);

  //         const maxId = Math.floor(100000 + Math.random() * 900000);
  //         setNewProfessor((prevProfessor) => ({ ...prevProfessor, id: maxId }));
  //       } catch (error) {
  //         console.error("Erro ao buscar Professores:", error);
  //       }
  //     };

  //     handleProfessor();
  //   }, []);

  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      {/* Listagem de Professores */}
      <div style={{ flex: 1 }}>
        <h3>Lista de Professores</h3>
        <table className="table table-striped table-dark">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nome</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {professores.map((professor) => (
              <tr key={professor.id}>
                <td>{professor.id}</td>
                <td>{professor.nome}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => handleProfessorSelect(professor)}
                  >
                    Editar/Remover
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Button to Download PDF */}
        <Button variant="outline-success" onClick={handleDownloadPDF}>
          Baixar Relatório PDF
        </Button>
      </div>

      {/* Formulário de Cadastro de Professor */}
      <div
        className="form-register-container"
        style={{ flex: 1, backgroundColor: "#101625", padding: "20px" }}
      >
        <h3>Cadastrar novo professor</h3>
        <Form style={{ marginTop: "2rem" }}>
          <Form.Group className="mb-3" controlId="formMatricula">
            <Form.Label>Código</Form.Label>
            <Form.Control
              className="form-matricula"
              type="text"
              disabled
              value={newProfessor.id}
              onChange={(e) =>
                setNewProfessor({ ...newProfessor, id: Number(e.target.value) })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formNome">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              placeholder="Digite o nome"
              value={newProfessor.nome}
              onChange={(e) =>
                setNewProfessor({ ...newProfessor, nome: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formEspecialidade">
            <Form.Label>Especialidade</Form.Label>
            <Form.Control
              type="text"
              placeholder="Digite a especialidade"
              value={newProfessor.especialidade}
              onChange={(e) =>
                setNewProfessor({
                  ...newProfessor,
                  especialidade: e.target.value,
                })
              }
            />
          </Form.Group>

          <div className="form-row">
            <Form.Group className="mb-3" controlId="formDataNascimento">
              <Form.Label>Data de Nascimento</Form.Label>
              <Form.Control
                type="date"
                value={formatDateForInput(newProfessor.dataNascimento!)}
                onChange={(e) =>
                  setNewProfessor({
                    ...newProfessor,
                    dataNascimento: formatDateForSave(e.target.value),
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formGenero">
              <Form.Label>Gênero</Form.Label>
              <Form.Control
                as="select"
                value={newProfessor.genero!}
                onChange={(e) =>
                  setNewProfessor({ ...newProfessor, genero: e.target.value })
                }
              >
                <option value="">Selecione o gênero</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
              </Form.Control>
            </Form.Group>
          </div>
          <div className="form-row">
            <Form.Group className="mb-3" controlId="formTelefone">
              <Form.Label>Telefone</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o telefone"
                value={newProfessor.telefone!}
                onChange={(e) =>
                  setNewProfessor({ ...newProfessor, telefone: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formCelular">
              <Form.Label>Celular</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o celular"
                value={newProfessor.celular!}
                onChange={(e) =>
                  setNewProfessor({ ...newProfessor, celular: e.target.value })
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
                value={newProfessor.cidade!}
                onChange={(e) =>
                  setNewProfessor({ ...newProfessor, cidade: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formUF">
              <Form.Label>UF</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o UF"
                value={newProfessor.estado!}
                onChange={(e) =>
                  setNewProfessor({ ...newProfessor, estado: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formCep">
              <Form.Label>CEP</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o CEP"
                value={newProfessor.cep!}
                onChange={(e) =>
                  setNewProfessor({ ...newProfessor, cep: e.target.value })
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
                value={newProfessor.rua!}
                onChange={(e) =>
                  setNewProfessor({ ...newProfessor, rua: e.target.value })
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
                value={newProfessor.numero!}
                onChange={(e) =>
                  setNewProfessor({ ...newProfessor, numero: e.target.value })
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
                value={newProfessor.bairro!}
                onChange={(e) =>
                  setNewProfessor({ ...newProfessor, bairro: e.target.value })
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
                setNewProfessor({
                  id: 0,
                  nome: "",
                  especialidade: "",
                  telefone: "",
                  genero: "",
                  dataNascimento: "",
                  celular: "",
                  email: "",
                  rua: "",
                  numero: "",
                  complemento: "",
                  bairro: "",
                  cidade: "",
                  estado: "",
                  cep: "",
                  pais: "",
                })
              }
            >
              Limpar
            </Button>
            <Button variant="primary" onClick={handleAddProfessor}>
              Cadastrar
            </Button>
          </div>
        </Form>
      </div>

      {/* Modal para Editar/Remover Professor */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header
          closeButton
          style={{ backgroundColor: "rgb(16, 22, 37)", color: "white" }}
        >
          <Modal.Title>
            {selectedProfessor
              ? `Editar: ${selectedProfessor.nome}`
              : "Novo Professor"}
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
                className="form-matricula"
                value={selectedProfessor?.id || ""}
                onChange={(e) =>
                  setSelectedProfessor({
                    ...selectedProfessor,
                    id: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formNome">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                value={selectedProfessor?.nome || ""}
                onChange={(e) =>
                  setSelectedProfessor({
                    ...selectedProfessor,
                    nome: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEspecialidade">
              <Form.Label>Especialidade</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite a especialidade"
                value={selectedProfessor?.especialidade || ""}
                onChange={(e) =>
                  setSelectedProfessor({
                    ...selectedProfessor,
                    especialidade: e.target.value,
                  })
                }
              />
            </Form.Group>

            <div className="form-row" style={{ gap: "2rem" }}>
              <Form.Group className="mb-3" controlId="formDataNascimento">
                <Form.Label>Data de Nascimento</Form.Label>
                <Form.Control
                  type="date"
                  value={formatDateForInput(
                    selectedProfessor?.dataNascimento || ""
                  )}
                  onChange={(e) =>
                    setSelectedProfessor({
                      ...selectedProfessor,
                      dataNascimento: formatDateForSave(e.target.value),
                    })
                  }
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                style={{ minWidth: "100px" }}
                controlId="formGenero"
              >
                <Form.Label>Gênero</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedProfessor?.genero || ""}
                  onChange={(e) =>
                    setSelectedProfessor({
                      ...selectedProfessor,
                      genero: e.target.value,
                    })
                  }
                >
                  <option value="">Selecione o gênero</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                </Form.Control>
              </Form.Group>

              <Form.Group
                className="mb-3"
                style={{ minWidth: "100px" }}
                controlId="formAtivo"
              >
                <Form.Label>Ativo</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedProfessor?.ativo ? "Ativo" : "Inativo"} // Mapeia boolean para texto
                  onChange={(e) =>
                    setSelectedProfessor({
                      ...selectedProfessor,
                      ativo: e.target.value === "Ativo", // Converte texto para boolean
                    })
                  }
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </Form.Control>
              </Form.Group>
            </div>

            <div className="form-row" style={{ gap: "3rem" }}>
              <Form.Group className="mb-3" controlId="formTelefone">
                <Form.Label>Telefone</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedProfessor?.telefone || ""}
                  onChange={(e) =>
                    setSelectedProfessor({
                      ...selectedProfessor,
                      telefone: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formCelular">
                <Form.Label>Celular</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedProfessor?.celular || ""}
                  onChange={(e) =>
                    setSelectedProfessor({
                      ...selectedProfessor,
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
                  value={selectedProfessor?.cidade || ""}
                  onChange={(e) =>
                    setSelectedProfessor({
                      ...selectedProfessor,
                      cidade: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formUF">
                <Form.Label>UF</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedProfessor?.estado || ""}
                  onChange={(e) =>
                    setSelectedProfessor({
                      ...selectedProfessor,
                      estado: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formCep">
                <Form.Label>CEP</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedProfessor?.cep || ""}
                  onChange={(e) =>
                    setSelectedProfessor({
                      ...selectedProfessor,
                      cep: e.target.value,
                    })
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
                  value={selectedProfessor?.rua || ""}
                  onChange={(e) =>
                    setSelectedProfessor({
                      ...selectedProfessor,
                      rua: e.target.value,
                    })
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
                  value={selectedProfessor?.numero || ""}
                  onChange={(e) =>
                    setSelectedProfessor({
                      ...selectedProfessor,
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
                  value={selectedProfessor?.bairro || ""}
                  onChange={(e) =>
                    setSelectedProfessor({
                      ...selectedProfessor,
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
          <Button variant="danger" onClick={handleRemoveProfessor}>
            Remover Professor
          </Button>
          <Button variant="primary" onClick={handleEditProfessor}>
            Salvar Alterações
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Profissionais;
