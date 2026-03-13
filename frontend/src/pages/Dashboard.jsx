import React, { useState, useEffect } from "react";
import "../styles/dashboard.css";
import KnowledgeTable from "../components/KnowledgeTable";
import TeamManager from "../components/TeamManager";

export default function Dashboard({ onLogout }) {
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch("http://localhost:8000/team");
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
        {selectedEmployee && <KnowledgeTable employee={selectedEmployee} />}
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>© 2026 Employee Knowledge Management System. All rights reserved.</p>
      </footer>
    </div>
  );
}