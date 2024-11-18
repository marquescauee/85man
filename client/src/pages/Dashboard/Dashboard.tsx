/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Nav, Tab, Container } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import "./Dashboard.css";
import Users from "../../components/Users/Users";
import Professionals from "../../components/Professionals/Professionals";
import Atividades from "../../components/Atividades/Atividades";
import { useAuth } from "../../context/AuthContext";
import { AtividadeSelect } from "../../../../api/src/types";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const initialTab = new URLSearchParams(location.search).get("tab") || "1";
  const [activeTab, setActiveTab] = useState(initialTab);

  const [usersData, setUsersData] = useState(null);
  const [atividadesData, setAtividadesData] = useState(null);
  const [professionalsData, setProfessionalsData] = useState(null);

  const handleTabChange = (selectedTab: string | null) => {
    if (selectedTab) {
      setActiveTab(selectedTab);
      navigate(`/dashboard?tab=${selectedTab}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Função para buscar os dados
  const fetchData = async (tab: string) => {
    switch (tab) {
      case "1":
        if (!usersData) {
          const response = await fetch("http://localhost:3000/alunos");
          const data = await response.json();
          setUsersData(data);
        }
        break;
      case "2":
        if (!atividadesData) {
          const response = await fetch("http://localhost:3000/atividades");
          const data = await response.json();

          data.forEach((atividade: AtividadeSelect) => {
            const formatTime = (dateString: string) => {
              const date = new Date(dateString);
              const hours = String(date.getHours() + 3).padStart(2, "0");
              const minutes = String(date.getMinutes()).padStart(2, "0");
              return `${hours}:${minutes}`;
            };

            atividade.horaInicio = formatTime(atividade.horaInicio!);
            atividade.horaFim = formatTime(atividade.horaFim!);
          });

          setAtividadesData(data);

          if (!professionalsData) {
            const professionalsResponse = await fetch(
              "http://localhost:3000/professores"
            );
            const professionalsData = await professionalsResponse.json();
            setProfessionalsData(professionalsData);
          }
        }
        break;
      case "3":
        if (!professionalsData) {
          const response = await fetch("http://localhost:3000/professores");
          const data = await response.json();
          setProfessionalsData(data);
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  useEffect(() => {
    const urlTab = new URLSearchParams(location.search).get("tab") || "1";
    setActiveTab(urlTab);
  }, [location.search]);

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
              {activeTab === "1" && (
                <div>
                  {usersData ? (
                    <Users usersData={usersData} />
                  ) : (
                    <p>Carregando dados de Alunos...</p>
                  )}
                </div>
              )}
              {activeTab === "2" && (
                <div>
                  {atividadesData ? (
                    <Atividades
                      atividadesData={atividadesData}
                      professionalsData={professionalsData ?? []}
                    />
                  ) : (
                    <p>Carregando dados de Atividades...</p>
                  )}
                </div>
              )}
              {activeTab === "3" && (
                <div>
                  {professionalsData ? (
                    <Professionals professionalsData={professionalsData} />
                  ) : (
                    <p>Carregando dados de Profissionais...</p>
                  )}
                </div>
              )}
              {activeTab === "4" && <p>Conteúdo da aba Equipamentos</p>}
              {activeTab === "5" && <p>Conteúdo da aba Horários</p>}
              {activeTab === "6" && <p>Conteúdo da aba Produtos</p>}
            </Tab.Content>
          </main>
        </Tab.Container>
      </header>
    </Container>
  );
};

export default Dashboard;
