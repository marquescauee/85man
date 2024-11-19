import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { jsPDF } from "jspdf";

interface Produto {
  id?: number;
  nome: string;
  quantidadeEstoque: number;
  preco: number;
}

interface ProdutosProps {
  produtosData: Produto[];
}

const Produtos = ({ produtosData }: ProdutosProps) => {
  const getDefaultProduto = (): Produto => ({
    nome: "",
    quantidadeEstoque: 0,
    preco: 0,
  });

  const [produtos, setProdutos] = useState<Produto[]>(produtosData);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null);
  const [newProduto, setNewProduto] = useState<Produto>(getDefaultProduto());

  const handleProdutoSelect = (produto: Produto) => {
    setSelectedProduto(produto);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduto(null);
  };

  const validateProduto = (produto: Produto): boolean => {
    if (!produto.nome || produto.quantidadeEstoque <= 0 || produto.preco <= 0) {
      alert("Por favor, preencha todos os campos corretamente.");
      return false;
    }
    return true;
  };

  const handleAddProduto = async () => {
    if (!validateProduto(newProduto)) return;

    try {
      const response = await fetch("http://localhost:3000/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduto),
      });

      if (!response.ok) throw new Error("Erro ao adicionar produto.");
      const newProdutoFromServer = await response.json();

      setProdutos((prev) => [...prev, newProdutoFromServer]);
      setNewProduto(getDefaultProduto());
    } catch (error) {
      alert("Erro ao cadastrar produto. Tente novamente.");
      console.error(error);
    }
  };

  const handleEditProduto = async () => {
    if (!selectedProduto) return;

    try {
      const response = await fetch(
        `http://localhost:3000/produtos/${selectedProduto.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedProduto),
        }
      );

      if (!response.ok) throw new Error("Erro ao editar produto.");
      const updatedProduto = await response.json();

      setProdutos((prev) =>
        prev.map((produto) =>
          produto.id === selectedProduto.id ? updatedProduto : produto
        )
      );
      handleCloseModal();
    } catch (error) {
      alert("Erro ao editar produto. Tente novamente.");
      console.error(error);
    }
  };

  const handleRemoveProduto = async () => {
    if (!selectedProduto) return;

    if (!window.confirm("Tem certeza de que deseja remover este produto?"))
      return;

    try {
      await fetch(`http://localhost:3000/produtos/${selectedProduto.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      setProdutos((prev) =>
        prev.filter((produto) => produto.id !== selectedProduto.id)
      );
      handleCloseModal();
    } catch (error) {
      alert("Erro ao remover produto. Tente novamente.");
      console.error(error);
    }
  };

  // Função para formatar o preço de venda como moeda
  const formatCurrency = (value: number): string => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // Função para gerar o relatório em PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");

    // Título
    doc.setFontSize(18);
    doc.text("Relatório de Produtos", 14, 20);

    // Cabeçalhos das colunas
    doc.setFontSize(12);
    doc.text("ID", 14, 30);
    doc.text("Nome", 40, 30);
    doc.text("quantidadeEstoque", 100, 30);
    doc.text("Preço de Venda", 160, 30);

    let yOffset = 40;

    // Iterar sobre os produtos cadastrados
    produtos.forEach((produto, index) => {
      if (index > 0 && index % 25 === 0) {
        doc.addPage();
        yOffset = 20; // Ajusta o yOffset após adicionar uma nova página
      }

      doc.text(String(produto.id), 14, yOffset);
      doc.text(produto.nome || "", 40, yOffset);
      doc.text(String(produto.quantidadeEstoque), 100, yOffset);
      doc.text(formatCurrency(produto.preco), 160, yOffset);

      yOffset += 10;
    });

    // Salvando o PDF
    doc.save("relatorio_produtos.pdf");
  };

  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      {/* Lista de Produtos */}
      <div style={{ flex: 1 }}>
        <h3>Lista de Produtos</h3>
        <table className="table table-striped table-dark">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Quantidade</th>
              <th>Preço de Venda</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((produto) => (
              <tr key={produto.id}>
                <td>{produto.id}</td>
                <td>{produto.nome}</td>
                <td>{produto.quantidadeEstoque}</td>
                <td>{formatCurrency(produto.preco)}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => handleProdutoSelect(produto)}
                  >
                    Editar/Remover
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Botão para gerar o PDF */}
        <Button variant="outline-success" onClick={handleDownloadPDF}>
          Gerar Relatório PDF
        </Button>
      </div>

      {/* Formulário de Cadastro de Produto */}
      <div
        className="form-register-container"
        style={{ flex: 1, backgroundColor: "#101625", padding: "20px" }}
      >
        <h3>Cadastrar novo produto</h3>
        <Form style={{ marginTop: "2rem" }}>
          <Form.Group className="mb-3" controlId="formNome">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              placeholder="Digite o nome"
              value={newProduto.nome}
              onChange={(e) =>
                setNewProduto({ ...newProduto, nome: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formquantidadeEstoque">
            <Form.Label>Quantidade</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={newProduto.quantidadeEstoque}
              onChange={(e) =>
                setNewProduto({
                  ...newProduto,
                  quantidadeEstoque: parseInt(e.target.value),
                })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formpreco">
            <Form.Label>Preço de Venda</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              min="0"
              value={newProduto.preco}
              onChange={(e) =>
                setNewProduto({
                  ...newProduto,
                  preco: parseFloat(e.target.value),
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
              onClick={() => setNewProduto(getDefaultProduto())}
            >
              Limpar
            </Button>
            <Button variant="primary" onClick={handleAddProduto}>
              Cadastrar
            </Button>
          </div>
        </Form>
      </div>

      {/* Modal para Editar/Remover Produto */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Produto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formNome">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                value={selectedProduto?.nome || ""}
                onChange={(e) =>
                  setSelectedProduto({
                    ...selectedProduto!,
                    nome: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formquantidadeEstoque">
              <Form.Label>Quantidade</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={selectedProduto?.quantidadeEstoque || 0}
                onChange={(e) =>
                  setSelectedProduto({
                    ...selectedProduto!,
                    quantidadeEstoque: parseInt(e.target.value),
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formpreco">
              <Form.Label>Preço de Venda</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                value={selectedProduto?.preco || 0}
                onChange={(e) =>
                  setSelectedProduto({
                    ...selectedProduto!,
                    preco: parseFloat(e.target.value),
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="danger" onClick={handleRemoveProduto}>
            Remover
          </Button>
          <Button variant="primary" onClick={handleEditProduto}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Produtos;
