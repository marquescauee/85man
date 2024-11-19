import React, { useState } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import { Aluno } from "../Users/Users";

interface Matricula {
  id: string;
  alunoId: string;
  dataMatricula: string;
  dataCancelamento?: string;
}

interface MatriculasProps {
  matriculasData: Matricula[];
  alunosData: Aluno[];
}

const Matriculas = ({ matriculasData, alunosData }: MatriculasProps) => {
  const [matriculas, setMatriculas] = useState<Matricula[]>(matriculasData);
  const [showModal, setShowModal] = useState(false);
  const [newMatricula, setNewMatricula] = useState<Partial<Matricula>>({
    alunoId: "",
  });

  // Abrir modal
  const handleOpenModal = () => setShowModal(true);

  // Fechar modal
  const handleCloseModal = () => {
    setShowModal(false);
    setNewMatricula({ alunoId: "" });
  };

  // Adicionar nova matrícula
  const handleAddMatricula = async () => {
    const matricula = {
      alunoId: newMatricula.alunoId!,
      dataMatricula: new Date().toISOString(), // Preenche automaticamente com a data atual
    };

    const response = await fetch("http://localhost:3000/matriculas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(matricula),
    });

    const novaMatricula = await response.json();
    setMatriculas((prev) => [...prev, novaMatricula]);

    handleCloseModal();
  };

  // Cancelar matrícula
  const handleCancelMatricula = async (matriculaId: string) => {
    const dataCancelamento = new Date().toISOString();

    let matricula = matriculas.find((m) => m.id === matriculaId);
  
    if (!matricula) {
      alert(`500: Matricula não encontrada com o ID ${matriculaId}.`)
    };

    matricula!.dataCancelamento = dataCancelamento;

    const response = await fetch(
      `http://localhost:3000/matriculas/${matriculaId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(matricula),
      }
    );

    const updatedMatricula = await response.json();
    setMatriculas((prev) =>
      prev.map((matricula) =>
        matricula.id === updatedMatricula.id ? updatedMatricula : matricula
      )
    );
  };

  return (
    <div>
      <h3>Lista de Matrículas</h3>
      <table className="table table-striped table-dark">
        <thead>
          <tr>
            <th>ID</th>
            <th>Aluno</th>
            <th>Data Matrícula</th>
            <th>Data Cancelamento</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {matriculas.map((matricula) => (
            <tr key={matricula.id}>
              <td>{matricula.id}</td>
              <td>
                {alunosData.find((aluno) => aluno.id === matricula.alunoId)
                  ?.nome || "Desconhecido"}
              </td>
              <td>{matricula.dataMatricula}</td>
              <td>{matricula.dataCancelamento || "Ativa"}</td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => handleCancelMatricula(matricula.id)}
                >
                  Cancelar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button variant="success" onClick={handleOpenModal}>
        Nova Matrícula
      </Button>

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Nova Matrícula</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formAluno">
              <Form.Label>Aluno</Form.Label>
              <Form.Control
                as="select"
                value={newMatricula.alunoId}
                onChange={(e) =>
                  setNewMatricula({ ...newMatricula, alunoId: e.target.value })
                }
              >
                <option value="">Selecione um aluno</option>
                {alunosData.map((aluno) => (
                  <option key={aluno.id} value={aluno.id}>
                    {aluno.nome}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            onClick={handleAddMatricula}
            disabled={!newMatricula.alunoId}
          >
            Cadastrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Matriculas;
