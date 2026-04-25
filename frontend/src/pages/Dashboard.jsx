import React, { useState, useEffect } from "react";
import "../styles/dashboard.css";
import KnowledgeTable from "../components/KnowledgeTable";
import TeamManager from "../components/TeamManager";
import API_URL from "../config/api";

export default function Dashboard({ onLogout }) {
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedSheet, setSelectedSheet] = useState("sheet1");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch(`${API_URL}/team`);
      const data = await response.json();
      setTeamMembers(data || []);
      if (data.length > 0) {
        setSelectedEmployee(data[0].name);
      }
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  const handleTeamUpdate = (updatedMembers) => {
    setTeamMembers(updatedMembers);
    if (updatedMembers.length > 0 && !selectedEmployee) {
      setSelectedEmployee(updatedMembers[0].name);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`dashboard-container ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* Header */}
      <header className={`dashboard-header ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🧠</span>
            <h1>Employee Knowledge Management</h1>
          </div>
          <div className="header-actions">
            <div className="dark-mode-toggle">
              <span className="toggle-text">🌙</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={isDarkMode}
                  onChange={toggleDarkMode}
                />
                <span className="slider"></span>
              </label>
              <span className="toggle-text">☀️</span>
            </div>
            <button onClick={onLogout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Sheet Navigation */}
      <div className={`sheet-navigation ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className="sheet-tabs">
          <button
            onClick={() => setSelectedSheet("sheet1")}
            className={`sheet-tab ${selectedSheet === "sheet1" ? "active" : ""}`}
          >
            <span className="sheet-icon">📊</span>
            Sheet 1 - Project Alpha
          </button>
          <button
            onClick={() => setSelectedSheet("sheet2")}
            className={`sheet-tab ${selectedSheet === "sheet2" ? "active" : ""}`}
          >
            <span className="sheet-icon">📈</span>
            Sheet 2 - Project Beta
          </button>
        </div>
      </div>

      {/* Team Manager */}
      <div className="team-container">
        <TeamManager onTeamUpdate={handleTeamUpdate} />
      </div>

      {/* Employee Tabs */}
      <div className="tabs-container">
        <div className="tabs">
          {teamMembers.map((member) => (
            <button
              key={member.id}
              onClick={() => setSelectedEmployee(member.name)}
              className={`tab ${selectedEmployee === member.name ? "active" : ""}`}
            >
              <span className="tab-icon">👤</span>
              {member.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="sheet-content">
          <div className="sheet-header">
            <h2>
              <span className="sheet-icon">
                {selectedSheet === "sheet1" ? "📊" : "📈"}
              </span>
              {selectedSheet === "sheet1" ? "Project Alpha" : "Project Beta"}
            </h2>
            <p className="sheet-description">
              {selectedSheet === "sheet1" 
                ? "Managing knowledge and workflows for Project Alpha"
                : "Managing knowledge and workflows for Project Beta"}
            </p>
          </div>
          
          {selectedEmployee && (
            <div className="employee-section">
              <h3>Team Member: {selectedEmployee}</h3>
              <KnowledgeTable employee={selectedEmployee} sheet={selectedSheet} />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p> 2026 Employee Knowledge Management System. All rights reserved.</p>
      </footer>
    </div>
  );
}