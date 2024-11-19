import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { jsPDF } from "jspdf";

interface Equipamento {
  id?: number;
  nome?: string;
  tipo?: string;
  dataAquisicao: string;
}

interface EquipamentoProps {
  equipamentosData: Equipamento[];
}

const Equipamentos = ({ equipamentosData }: EquipamentoProps) => {
  const getDefaultEquipamento = (): Equipamento => ({
    nome: "",
    tipo: "",
    dataAquisicao: "",
  });

  const [equipamentos, setEquipamentos] =
    useState<Equipamento[]>(equipamentosData);
  const [showModal, setShowModal] = useState(false);
  const [selectedEquipamento, setSelectedEquipamento] = useState<any>(null);
  const [newEquipamento, setNewEquipamento] = useState<Equipamento>(
    getDefaultEquipamento()
  );

  const handleEquipamentoSelect = (equipamento: Equipamento) => {
    setSelectedEquipamento(equipamento);
    setShowModal(true);
  };

  const formatDateForInput = (date: string | undefined) => {
    if (!date) return ""; // Se a data estiver vazia ou indefinida, retorna uma string vazia

    const [day, month, year] = date.split("/");

    // Verifica se a data foi formatada corretamente
    if (day && month && year) {
      return `${year}-${month}-${day}`; // Formato adequado para o campo de input tipo "date"
    }

    return ""; // Caso a data esteja em um formato inesperado, retorna uma string vazia
  };

  const formatDateForSave = (date: string) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`; // Formato para salvar
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEquipamento(null);
  };

  const validateEquipamento = (equipamento: Equipamento): boolean => {
    if (!equipamento.nome || !equipamento.tipo || !equipamento.dataAquisicao) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return false;
    }
    return true;
  };

  const handleAddEquipamento = async () => {
    if (!validateEquipamento(newEquipamento)) return;

    try {
      const response = await fetch("http://localhost:3000/equipamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEquipamento),
      });

      if (!response.ok) throw new Error("Erro ao adicionar equipamento.");
      const newEquipamentoFromServer = await response.json();

      setEquipamentos((prev) => [...prev, newEquipamentoFromServer]);
      setNewEquipamento(getDefaultEquipamento());
    } catch (error) {
      alert("Erro ao cadastrar equipamento. Tente novamente.");
      console.error(error);
    }
  };

  const handleEditEquipamento = async () => {
    if (!selectedEquipamento) return;

    try {
      const response = await fetch(
        `http://localhost:3000/equipamentos/${selectedEquipamento.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedEquipamento),
        }
      );

      if (!response.ok) throw new Error("Erro ao editar equipamento.");
      const updatedEquipamento = await response.json();

      setEquipamentos((prev) =>
        prev.map((equipamento) =>
          equipamento.id === selectedEquipamento.id
            ? updatedEquipamento
            : equipamento
        )
      );
      handleCloseModal();
    } catch (error) {
      alert("Erro ao editar equipamento. Tente novamente.");
      console.error(error);
    }
  };

  const handleRemoveEquipamento = async () => {
    if (!selectedEquipamento) return;

    if (!window.confirm("Tem certeza de que deseja remover este equipamento?"))
      return;

    try {
      await fetch(
        `http://localhost:3000/equipamentos/${selectedEquipamento.id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      setEquipamentos((prev) =>
        prev.filter((equipamento) => equipamento.id !== selectedEquipamento.id)
      );
      handleCloseModal();
    } catch (error) {
      alert("Erro ao remover equipamento. Tente novamente.");
      console.error(error);
    }
  };

  // Função para gerar o relatório em PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");

    // Título
    doc.setFontSize(18);
    doc.text("Relatório de Equipamentos Cadastrados", 14, 20);

    // Cabeçalhos das colunas
    doc.setFontSize(12);
    doc.text("ID", 14, 30);
    doc.text("Nome", 40, 30);
    doc.text("Tipo", 100, 30);
    doc.text("Data de Aquisição", 160, 30);

    let yOffset = 40;

    const formatDateForPDF = (date: string) => {
      if (!date) return "";

      // Cria um objeto Date a partir da string ISO
      const dateObj = new Date(date);

      // Verifica se a data é válida
      if (isNaN(dateObj.getTime())) return "";

      // Extrai o dia, mês e ano da data
      const day = String(dateObj.getDate()).padStart(2, "0");
      const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Janeiro é 0, então somamos 1
      const year = dateObj.getFullYear();

      return `${day}/${month}/${year}`; // Retorna a data no formato DD/MM/YYYY
    };

    // Iterar sobre os equipamentos cadastrados
    equipamentos.forEach((equipamento, index) => {
      if (index > 0 && index % 25 === 0) {
        doc.addPage();
        yOffset = 20; // Ajusta o yOffset após adicionar uma nova página
      }

      console.log(formatDateForPDF(equipamento.dataAquisicao));

      doc.text(String(equipamento.id), 14, yOffset);
      doc.text(equipamento.nome || "", 40, yOffset);
      doc.text(equipamento.tipo || "", 100, yOffset);
      doc.text(formatDateForPDF(equipamento.dataAquisicao), 160, yOffset);

      yOffset += 10;
    });

    // Salvando o PDF
    doc.save("relatorio_equipamentos.pdf");
  };

  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      {/* Lista de Equipamentos */}
      <div style={{ flex: 1 }}>
        <h3>Lista de Equipamentos</h3>
        <table
          className="table table-striped table-dark"
          style={{ marginTop: "20px" }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Tipo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {equipamentos.map((equipamento) => (
              <tr key={equipamento.id}>
                <td>{equipamento.id}</td>
                <td>{equipamento.nome}</td>
                <td>{equipamento.tipo}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => handleEquipamentoSelect(equipamento)}
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

      {/* Formulário de Cadastro de Equipamento */}
      <div
        className="form-register-container"
        style={{ flex: 1, backgroundColor: "#101625", padding: "20px" }}
      >
        <h3>Cadastrar novo equipamento</h3>
        <Form style={{ marginTop: "2rem" }}>
          <Form.Group className="mb-3" controlId="formNome">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              placeholder="Digite o nome"
              value={newEquipamento.nome}
              onChange={(e) =>
                setNewEquipamento({ ...newEquipamento, nome: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formTipo">
            <Form.Label>Tipo</Form.Label>
            <Form.Control
              type="text"
              placeholder="Digite o tipo"
              value={newEquipamento.tipo}
              onChange={(e) =>
                setNewEquipamento({ ...newEquipamento, tipo: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formDataAquisicao">
            <Form.Label>Data de Aquisição</Form.Label>
            <Form.Control
              type="date"
              value={formatDateForInput(newEquipamento.dataAquisicao!)}
              onChange={(e) =>
                setNewEquipamento({
                  ...newEquipamento,
                  dataAquisicao: formatDateForSave(e.target.value),
                })
              }
            />
          </Form.Group>

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
              onClick={() => setNewEquipamento(getDefaultEquipamento())}
            >
              Limpar
            </Button>
            <Button variant="primary" onClick={handleAddEquipamento}>
              Cadastrar
            </Button>
          </div>
        </Form>
      </div>

      {/* Modal para Editar/Remover Equipamento */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Equipamento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formNome">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                value={selectedEquipamento?.nome || ""}
                onChange={(e) =>
                  setSelectedEquipamento({
                    ...selectedEquipamento!,
                    nome: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formTipo">
              <Form.Label>Tipo</Form.Label>
              <Form.Control
                type="text"
                value={selectedEquipamento?.tipo || ""}
                onChange={(e) =>
                  setSelectedEquipamento({
                    ...selectedEquipamento!,
                    tipo: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formDataAquisicao">
              <Form.Label>Data de Aquisição</Form.Label>
              <Form.Control
                type="date"
                value={formatDateForInput(
                  selectedEquipamento?.dataAquisicao || ""
                )}
                onChange={(e) =>
                  setSelectedEquipamento({
                    ...selectedEquipamento!,
                    dataAquisicao: formatDateForSave(e.target.value),
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="danger" onClick={handleRemoveEquipamento}>
            Remover
          </Button>
          <Button variant="primary" onClick={handleEditEquipamento}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Equipamentos;
