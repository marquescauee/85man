import React, { useState } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { ProdutoSelect as Produto } from "../../../../api/src/types";

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
      return produto.preco * qtd;
    }
    return 0;
  };

  const handleProdutoChange = (e: any) => {
    const produtoId = Number(e.target.value);
    const produto = produtosData.find((prod) => prod.id === produtoId) || null;
    setProdutoSelecionado(produto);
    setTotalVenda(
      calcularTotalVenda(
        produto || { id: 0, nome: "", preco: 0, quantidadeEstoque: 0 },
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

  const handleVender = async () => {
    if (!produtoSelecionado) {
      alert("Selecione um produto.");
      return;
    }
    if (quantidade <= 0) {
      alert("Selecione uma quantidade.");
      return;
    }
    if (quantidade > produtoSelecionado.quantidadeEstoque) {
      alert(`Quantidade ${quantidade} excede o estoque do produto ${produtoSelecionado.nome}, que tem ${produtoSelecionado.quantidadeEstoque} unidades.`);
      return;
    }
    
    const novaQuantidadeEstoque = produtoSelecionado.quantidadeEstoque - quantidade;

    setProdutoSelecionado({
      ...produtoSelecionado,
      quantidadeEstoque: novaQuantidadeEstoque,
    });

    try {
      const response = await fetch(
        `http://localhost:3000/produtos/${produtoSelecionado.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(produtoSelecionado),
        }
      );

      if (!response.ok) throw new Error("Erro ao editar produto.");
    } catch (error) {
      alert("Erro ao editar produto. Tente novamente.");
      console.error(error);
    }

    alert(
      `Venda realizada com sucesso! Produto: ${
        produtoSelecionado.nome
      }, Quantidade: ${quantidade}, Total: R$ ${totalVenda.toFixed(2)}`
    );
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
                    {produto.nome} - R$ {produto.preco}
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
