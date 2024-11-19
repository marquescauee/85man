import React, { useState } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";

interface Produto {
  id: number;
  nome: string;
  precoVenda: number;
}

interface VendasProps {
  produtosData: Produto[];
}

const Venda = ({ produtosData }: VendasProps) => {
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(
    null
  );
  const [quantidade, setQuantidade] = useState<number>(1);
  const [totalVenda, setTotalVenda] = useState<number>(0);

  // Calcular o total da venda
  const calcularTotalVenda = (produto: Produto, qtd: number) => {
    if (produto) {
      return produto.precoVenda * qtd;
    }
    return 0;
  };

  const handleProdutoChange = (e: any) => {
    const produtoId = Number(e.target.value);
    const produto = produtosData.find((prod) => prod.id === produtoId) || null;
    setProdutoSelecionado(produto);
    setTotalVenda(
      calcularTotalVenda(
        produto || { id: 0, nome: "", precoVenda: 0 },
        quantidade
      )
    );
  };

  const handleQuantidadeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const qtd = Number(e.target.value);
    setQuantidade(qtd);
    if (produtoSelecionado) {
      setTotalVenda(calcularTotalVenda(produtoSelecionado, qtd));
    }
  };

  const handleVender = () => {
    if (!produtoSelecionado || quantidade <= 0) {
      alert("Selecione um produto e uma quantidade válida.");
      return;
    }
    alert(
      `Venda realizada com sucesso! Produto: ${
        produtoSelecionado.nome
      }, Quantidade: ${quantidade}, Total: R$ ${totalVenda.toFixed(2)}`
    );
    // Você pode adicionar a lógica para salvar a venda aqui.
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3>Vender Produto</h3>
      <Form>
        <Row>
          <Col>
            <Form.Group controlId="produto">
              <Form.Label>Produto</Form.Label>
              <Form.Control as="select" onChange={handleProdutoChange}>
                <option value="">Selecione um produto</option>
                {produtosData.map((produto) => (
                  <option key={produto.id} value={produto.id}>
                    {produto.nome} - R$ {produto.precoVenda}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="quantidade">
              <Form.Label>Quantidade</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={quantidade}
                onChange={handleQuantidadeChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <h4 style={{ marginTop: "4rem" }}>
              Total da Venda: R$ {totalVenda.toFixed(2)}
            </h4>
          </Col>
        </Row>
        <Button variant="primary" onClick={handleVender}>
          Vender
        </Button>
      </Form>
    </div>
  );
};

export default Venda;
