import React, { useState } from "react";
import { Nav, Tab, Container } from "react-bootstrap";
import "./Dashboard.css";
import Users from "../../components/Users/Users";
import Professionals from "../../components/Professionals/Professionals";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("1");

  const handleTabChange = (selectedTab: string | null) => {
    if (selectedTab) {
      setActiveTab(selectedTab);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Container fluid className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">GMV Academia</h1>
        <Tab.Container activeKey={activeTab} onSelect={handleTabChange}>
          <Nav
            variant="tabs"
            className="dashboard-tabs"
            style={{ alignItems: "baseline" }}
          >
            <Nav.Item>
              <Nav.Link eventKey="1">Alunos</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="2">Atividades</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="3">Profissionais</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="4">Equipamentos</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="5">Horários</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="6">Produtos</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <button className="logout-button" onClick={handleLogout}>
                Sair
              </button>
            </Nav.Item>
          </Nav>
          <main className="dashboard-body">
            <Tab.Content>
              <Tab.Pane eventKey="1">
                <Users />
              </Tab.Pane>
              <Tab.Pane eventKey="2">
                <p>Conteúdo da aba Atividades</p>
              </Tab.Pane>
              <Tab.Pane eventKey="3">
                <Professionals />
              </Tab.Pane>
              <Tab.Pane eventKey="4">
                <p>Conteúdo da aba Equipamentos</p>
              </Tab.Pane>
              <Tab.Pane eventKey="5">
                <p>Conteúdo da aba Horários</p>
              </Tab.Pane>
              <Tab.Pane eventKey="6">
                <p>Conteúdo da aba Produtos</p>
              </Tab.Pane>
            </Tab.Content>
          </main>
        </Tab.Container>
      </header>
    </Container>
  );
};

export default Dashboard;
