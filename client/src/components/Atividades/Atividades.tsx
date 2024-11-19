import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { AtividadeInsert, AtividadeSelect } from "../../../../api/src/types";
import { Professor } from "../Professionals/Professionals";
import "./Atividades.css";
import jsPDF from "jspdf";

interface AtividadesProps {
  atividadesData: AtividadeSelect[];
  professionalsData: Professor[];
}

const Atividades = ({ atividadesData, professionalsData }: AtividadesProps) => {
  const getDefaultAtividade = (): AtividadeInsert => ({
    nome: "",
    professorId: 0,
    descricao: "",
    horaInicio: "",
    horaFim: "",
  });

  const [atividades, setAtividades] =
    useState<AtividadeSelect[]>(atividadesData);
  const [showModal, setShowModal] = useState(false);
  const [selectedAtividade, setSelectedAtividade] =
    useState<AtividadeSelect | null>(null);
  const [newAtividade, setNewAtividade] = useState<AtividadeInsert>(
    getDefaultAtividade()
  );

  const generateTimeOptions = (): string[] => {
    const options: string[] = [];
    let currentTime = 9 * 60;
    const endTime = 18 * 60;

    while (currentTime <= endTime) {
      const hours = Math.floor(currentTime / 60);
      const minutes = currentTime % 60;
      const timeLabel = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
      options.push(timeLabel);
      currentTime += 30;
    }

    return options;
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");

    doc.setFontSize(18);
    doc.text("Relatório de Atividades Cadastradas", 14, 20);

    doc.setFontSize(12);
    doc.text("ID", 14, 30);
    doc.text("Nome", 50, 30);
    doc.text("Horário Inicial", 100, 30);
    doc.text("Horário Final", 140, 30);

    atividades.forEach((atividade, index) => {
      const yOffset = 40 + index * 10;
      doc.text(String(atividade.id), 14, yOffset);
      doc.text(atividade.nome, 50, yOffset);
      doc.text(String(atividade.horaInicio), 100, yOffset);
      doc.text(String(atividade.horaFim), 140, yOffset);
    });

    doc.save("relatorio_atividades.pdf");
  };

  const handleAtividadeSelect = (atividade: AtividadeSelect) => {
    setSelectedAtividade(atividade);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAtividade(null);
  };

  const validateAtividade = (atividade: AtividadeInsert): boolean => {
    if (
      !atividade.nome ||
      !atividade.descricao ||
      !atividade.horaInicio ||
      !atividade.horaFim
    ) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return false;
    }
    return true;
  };

  const handleAddAtividade = async () => {
    if (!validateAtividade(newAtividade)) return;

    console.log(newAtividade);

    try {
      const response = await fetch("http://localhost:3000/atividades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAtividade),
      });

      if (!response.ok) throw new Error("Erro ao adicionar atividade.");
      const newAtividadeFromServer = await response.json();

      setAtividades((prev) => [...prev, newAtividadeFromServer]);
      setNewAtividade(getDefaultAtividade());
    } catch (error) {
      alert("Erro ao cadastrar atividade. Tente novamente.");
      console.error(error);
    }
  };

  const handleEditAtividade = async () => {
    if (!selectedAtividade) return;

    try {
      const response = await fetch(
        `http://localhost:3000/atividades/${selectedAtividade.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedAtividade),
        }
      );

      if (!response.ok) throw new Error("Erro ao editar atividade.");
      const updatedAtividade = await response.json();

      const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const hours = String(date.getHours() + 3).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${hours}:${minutes}`;
      };

      updatedAtividade.horaInicio = formatTime(updatedAtividade.horaInicio!);
      updatedAtividade.horaFim = formatTime(updatedAtividade.horaFim!);

      setAtividades((prev) =>
        prev.map((atividade) =>
          atividade.id === selectedAtividade.id ? updatedAtividade : atividade
        )
      );
      handleCloseModal();
    } catch (error) {
      alert("Erro ao editar atividade. Tente novamente.");
      console.error(error);
    }
  };

  const handleRemoveAtividade = async () => {
    if (!selectedAtividade) return;

    if (!window.confirm("Tem certeza de que deseja remover esta atividade?"))
      return;

    try {
      await fetch(`http://localhost:3000/atividades/${selectedAtividade.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      setAtividades((prev) =>
        prev.filter((atividade) => atividade.id !== selectedAtividade.id)
      );
      handleCloseModal();
    } catch (error) {
      alert("Erro ao remover atividade. Tente novamente.");
      console.error(error);
    }
  };

  //   useEffect(() => {
  //     const fetchAtividades = async () => {
  //       setIsLoading(true);
  //       try {
  //         const response = await fetch("http://localhost:3000/atividades");
  //         if (!response.ok) throw new Error("Erro ao buscar atividades.");

  //         const atividadesData = await response.json();
  //         setAtividades(atividadesData);
  //       } catch (error) {
  //         alert("Erro ao carregar atividades. Tente novamente.");
  //         console.error(error);
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     };

  //     fetchAtividades();
  //   }, []);

  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      {/* Listagem de Atividades */}
      <div style={{ flex: 1 }}>
        <h3>Lista de Atividades</h3>
        <table className="table table-striped table-dark">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nome</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {atividades.map((atividade) => (
              <tr key={atividade.id}>
                <td>{atividade.id}</td>
                <td>{atividade.nome}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => handleAtividadeSelect(atividade)}
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

      {/* Formulário de Cadastro de Atividade */}
      <div
        className="form-register-container"
        style={{ flex: 1, backgroundColor: "#101625", padding: "20px" }}
      >
        <h3>Cadastrar nova atividade</h3>
        <Form style={{ marginTop: "2rem" }}>
          <Form.Group className="mb-3" controlId="formNome">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              placeholder="Digite o nome"
              value={newAtividade.nome}
              onChange={(e) =>
                setNewAtividade({ ...newAtividade, nome: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formDescricao">
            <Form.Label>Descrição</Form.Label>
            <Form.Control
              type="text"
              placeholder="Digite a descrição"
              value={newAtividade.descricao!}
              onChange={(e) =>
                setNewAtividade({ ...newAtividade, descricao: e.target.value })
              }
            />
          </Form.Group>
          <div className="form-cadastrar-atividade">
            <Form.Group className="mb-3" controlId="formHoraInicio">
              <Form.Label>Horário de Início</Form.Label>
              <Form.Control
                as="select"
                value={newAtividade.horaInicio!}
                onChange={(e) =>
                  setNewAtividade({
                    ...newAtividade,
                    horaInicio: e.target.value,
                  })
                }
              >
                <option value="">Selecione o horário inicial</option>
                {generateTimeOptions().map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formHoraFim">
              <Form.Label>Horário de Fim</Form.Label>
              <Form.Control
                as="select"
                value={newAtividade.horaFim!}
                onChange={(e) =>
                  setNewAtividade({ ...newAtividade, horaFim: e.target.value })
                }
              >
                <option value="">Selecione o horário final</option>
                {generateTimeOptions().map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formProfessor">
              <Form.Label>Professor</Form.Label>
              <Form.Control
                as="select"
                value={newAtividade?.professorId || ""}
                onChange={(e) =>
                  setNewAtividade({
                    ...newAtividade!,
                    professorId: Number(e.target.value),
                  })
                }
              >
                <option value="">Selecione um professor</option>
                {professionalsData?.map((prof) => (
                  <option key={prof.id} value={prof.id}>
                    {prof.nome}
                  </option>
                ))}
              </Form.Control>
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
              onClick={() => setNewAtividade(getDefaultAtividade())}
            >
              Limpar
            </Button>
            <Button variant="primary" onClick={handleAddAtividade}>
              Cadastrar
            </Button>
          </div>
        </Form>
      </div>

      {/* Modal para Editar/Remover Atividade */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedAtividade
              ? `Editar: ${selectedAtividade.nome}`
              : "Nova Atividade"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formNome">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                value={selectedAtividade?.nome || ""}
                onChange={(e) =>
                  setSelectedAtividade({
                    ...selectedAtividade!,
                    nome: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formDescricao">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                type="text"
                value={selectedAtividade?.descricao || ""}
                onChange={(e) =>
                  setSelectedAtividade({
                    ...selectedAtividade!,
                    descricao: e.target.value,
                  })
                }
              />
            </Form.Group>
            <div className="form-editar-atividade">
              <Form.Group className="mb-3" controlId="formHoraInicio">
                <Form.Label>Horário de Início</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedAtividade?.horaInicio || ""}
                  onChange={(e) => {
                    setSelectedAtividade({
                      ...selectedAtividade!,
                      horaInicio: e.target.value,
                    });
                  }}
                >
                  <option value="">Selecione o horário inicial</option>
                  {generateTimeOptions().map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formHoraFim">
                <Form.Label>Horário de Fim</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedAtividade?.horaFim || ""}
                  onChange={(e) =>
                    setSelectedAtividade({
                      ...selectedAtividade!,
                      horaFim: e.target.value,
                    })
                  }
                >
                  <option value="">Selecione o horário final</option>
                  {generateTimeOptions().map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formProfessor">
                <Form.Label>Professor</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedAtividade?.professorId || ""}
                  onChange={(e) =>
                    setSelectedAtividade({
                      ...selectedAtividade!,
                      professorId: Number(e.target.value),
                    })
                  }
                >
                  <option value="">Selecione um professor</option>
                  {professionalsData?.map((prof) => (
                    <option key={prof.id} value={prof.id}>
                      {prof.nome}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleRemoveAtividade}>
            Remover
          </Button>
          <Button variant="primary" onClick={handleEditAtividade}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Atividades;
