import React, { useState, useEffect } from "react";
import "../styles/dashboard.css";
import KnowledgeTable from "../components/KnowledgeTable";
import TeamManager from "../components/TeamManager";
import API_URL from "../config/api";

export default function Dashboard({ onLogout }) {
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [sheets, setSheets] = useState([
    { id: 'sheet1', name: 'Project Alpha', icon: '📊', password: 'alpha123' },
    { id: 'sheet2', name: 'Project Beta', icon: '📈', password: 'beta123' }
  ]);
  const [selectedSheet, setSelectedSheet] = useState("sheet1");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [editingSheet, setEditingSheet] = useState(null);
  const [newSheetName, setNewSheetName] = useState('');
  const [newSheetPassword, setNewSheetPassword] = useState('');
  const [sheetPasswords, setSheetPasswords] = useState({});
  
  // Admin Panel States
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminLoginPassword, setAdminLoginPassword] = useState('');
  const ADMIN_PANEL_PASSWORD = 'Trailytics@2026';

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

  const addNewSheet = () => {
    if (newSheetName.trim() && newSheetPassword.trim()) {
      const icons = ['📊', '📈', '📉', '📋', '📝', '🗂️', '📁', '📑', '📄', '📃'];
      const newSheet = {
        id: `sheet${Date.now()}`,
        name: newSheetName.trim(),
        icon: icons[sheets.length % icons.length],
        password: newSheetPassword.trim()
      };
      setSheets([...sheets, newSheet]);
      setNewSheetName('');
      setNewSheetPassword('');
      setShowAddSheet(false);
    }
  };

  const updateSheetName = (sheetId, newName) => {
    setSheets(sheets.map(sheet => 
      sheet.id === sheetId ? { ...sheet, name: newName } : sheet
    ));
    setEditingSheet(null);
  };

  const deleteSheet = (sheetId) => {
    if (sheets.length > 1) {
      const adminPass = prompt('Enter admin password to delete sheet:');
      if (adminPass === ADMIN_PANEL_PASSWORD) {
        setSheets(sheets.filter(sheet => sheet.id !== sheetId));
        if (selectedSheet === sheetId) {
          setSelectedSheet(sheets.find(s => s.id !== sheetId).id);
        }
        // Remove from password cache
        const newSheetPasswords = {...sheetPasswords};
        delete newSheetPasswords[sheetId];
        setSheetPasswords(newSheetPasswords);
      } else if (adminPass !== null) {
        alert('Incorrect admin password!');
      }
    }
  };

  const openAdminPanel = () => {
    setShowAdminPanel(true);
    setIsAdminAuthenticated(false);
    setAdminLoginPassword('');
  };

  const authenticateAdmin = () => {
    if (adminLoginPassword === ADMIN_PANEL_PASSWORD) {
      setIsAdminAuthenticated(true);
    } else {
      alert('Incorrect admin password!');
    }
  };

  const closeAdminPanel = () => {
    setShowAdminPanel(false);
    setIsAdminAuthenticated(false);
    setAdminLoginPassword('');
  };

  const selectSheet = (sheetId) => {
    const sheet = sheets.find(s => s.id === sheetId);
    if (sheet) {
      if (!sheetPasswords[sheetId]) {
        const password = prompt(`Enter password for ${sheet.name}:`);
        if (password === sheet.password) {
          setSheetPasswords({...sheetPasswords, [sheetId]: true});
          setSelectedSheet(sheetId);
        } else if (password !== null) {
          alert('Incorrect password!');
        }
      } else {
        setSelectedSheet(sheetId);
      }
    }
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
            <button onClick={openAdminPanel} className="btn-admin">
              🔐 Admin Panel
            </button>
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
          {sheets.map((sheet) => (
            <div key={sheet.id} className="sheet-tab-wrapper">
              {editingSheet === sheet.id ? (
                <div className="sheet-edit-form">
                  <input
                    type="text"
                    value={newSheetName}
                    onChange={(e) => setNewSheetName(e.target.value)}
                    placeholder="Sheet name"
                    className="sheet-name-input"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        updateSheetName(sheet.id, newSheetName);
                      }
                    }}
                  />
                  <button
                    onClick={() => updateSheetName(sheet.id, newSheetName)}
                    className="sheet-save-btn"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => setEditingSheet(null)}
                    className="sheet-cancel-btn"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => selectSheet(sheet.id)}
                  className={`sheet-tab ${selectedSheet === sheet.id ? "active" : ""}`}
                >
                  <span className="sheet-icon">{sheet.icon}</span>
                  {sheet.name}
                  <div className="sheet-actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingSheet(sheet.id);
                        setNewSheetName(sheet.name);
                      }}
                      className="sheet-edit-btn"
                      title="Edit sheet name"
                    >
                      ✏️
                    </button>
                    {sheets.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete "${sheet.name}"?`)) {
                            deleteSheet(sheet.id);
                          }
                        }}
                        className="sheet-delete-btn"
                        title="Delete sheet"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() => setShowAddSheet(true)}
            className="sheet-tab add-sheet-tab"
          >
            <span className="sheet-icon">➕</span>
            Add Sheet
          </button>
        </div>
        
        {showAddSheet && (
          <div className="add-sheet-modal">
            <div className="modal-content">
              <h3>Add New Sheet</h3>
              <input
                type="text"
                value={newSheetName}
                onChange={(e) => setNewSheetName(e.target.value)}
                placeholder="Sheet name"
                className="sheet-input"
              />
              <input
                type="password"
                value={newSheetPassword}
                onChange={(e) => setNewSheetPassword(e.target.value)}
                placeholder="Sheet password"
                className="sheet-input"
              />
              <div className="modal-actions">
                <button onClick={addNewSheet} className="btn-primary">
                  Add Sheet
                </button>
                <button onClick={() => {
                  setShowAddSheet(false);
                  setNewSheetName('');
                  setNewSheetPassword('');
                }} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
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
                {sheets.find(s => s.id === selectedSheet)?.icon || '�'}
              </span>
              {sheets.find(s => s.id === selectedSheet)?.name || 'Unknown Sheet'}
            </h2>
            <p className="sheet-description">
              Managing knowledge and workflows for {sheets.find(s => s.id === selectedSheet)?.name || 'Unknown Sheet'}
            </p>
            <div className="sheet-info">
              <small>
                🔒 Protected sheet • {sheets.length} total sheets
              </small>
            </div>
          </div>
          
          {selectedEmployee && (
            <div className="employee-section">
              <h3>Team Member: {selectedEmployee}</h3>
              <KnowledgeTable employee={selectedEmployee} sheet={selectedSheet} />
            </div>
          )}
        </div>
      </main>

      {/* Admin Panel Modal */}
      {showAdminPanel && (
        <div className="admin-panel-modal">
          <div className="admin-modal-content">
            {!isAdminAuthenticated ? (
              <div className="admin-login">
                <h3>🔐 Admin Panel Login</h3>
                <input
                  type="password"
                  value={adminLoginPassword}
                  onChange={(e) => setAdminLoginPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="admin-input"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      authenticateAdmin();
                    }
                  }}
                />
                <div className="admin-login-actions">
                  <button onClick={authenticateAdmin} className="btn-primary">
                    Login
                  </button>
                  <button onClick={closeAdminPanel} className="btn-secondary">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="admin-panel">
                <div className="admin-header">
                  <h3>🔐 Admin Panel</h3>
                  <button onClick={closeAdminPanel} className="admin-close-btn">
                    ✕
                  </button>
                </div>
                
                <div className="admin-content">
                  <div className="admin-section">
                    <h4>📋 Sheet Management</h4>
                    <div className="sheet-list">
                      {sheets.map((sheet) => (
                        <div key={sheet.id} className="sheet-item">
                          <div className="sheet-info-row">
                            <span className="sheet-icon">{sheet.icon}</span>
                            <div className="sheet-details">
                              <strong>{sheet.name}</strong>
                              <div className="sheet-credentials">
                                <span className="label">Password:</span>
                                <code className="password-display">{sheet.password}</code>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="admin-section">
                    <h4>📊 System Information</h4>
                    <div className="system-info">
                      <div className="info-item">
                        <span className="label">Total Sheets:</span>
                        <span className="value">{sheets.length}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Admin Password:</span>
                        <span className="value">{ADMIN_PANEL_PASSWORD}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Protected Sheets:</span>
                        <span className="value">{sheets.length}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="admin-section">
                    <h4>⚠️ Admin Actions</h4>
                    <div className="admin-actions-info">
                      <p><strong>Delete Sheet:</strong> Requires admin password confirmation</p>
                      <p><strong>Sheet Access:</strong> Each sheet has unique password protection</p>
                      <p><strong>Password Recovery:</strong> Use this panel to retrieve lost passwords</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="dashboard-footer">
        <p> 2026 Employee Knowledge Management System. All rights reserved.</p>
      </footer>
    </div>
  );
}