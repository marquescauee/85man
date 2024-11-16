import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface LoginModalProps {
  show: boolean;
  onClose: () => void;
}

const LoginModal = ({ show, onClose }: LoginModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError("Por favor, insira um e-mail válido.");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = () => {
    if (!email) {
      setLoginError("O campo e-mail é obrigatório.");
      return;
    }

    if (emailError) {
      setLoginError("Corrija o e-mail antes de prosseguir.");
      return;
    }

    if (!password) {
      setLoginError("O campo senha é obrigatório.");
      return;
    }

    setLoginError("");
    // Realizar a ação de login aqui
    console.log("Login realizado com sucesso!");
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>E-mail</Form.Label>
            <Form.Control
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={handleEmailChange}
              isInvalid={!!emailError}
            />
            <Form.Control.Feedback type="invalid">
              {emailError}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Senha</Form.Label>
            <Form.Control
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={handlePasswordChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {loginError && <div className="text-danger me-auto">{loginError}</div>}
        <Button variant="outline-dark" onClick={onClose}>
          Fechar
        </Button>
        <Button variant="success" onClick={handleLogin}>
          Entrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LoginModal;
