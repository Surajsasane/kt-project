import React, { useState, useEffect } from "react";
import "../styles/table.css";
import API_URL from "../config/api";

export default function KnowledgeTable({ employee }) {
  const [rows, setRows] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    brand: "",
    channel: "",
    email: "",
    db_table: "",
    remark: "",
    has_python_file: "",
    has_extra_file: "",
    has_video: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch data
  useEffect(() => {
    fetchData();
  }, [employee]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/knowledge/${employee}`);
      const data = await response.json();
      setRows(data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRow = async () => {
    const newRow = {
      employee,
      brand: "New Task",
      channel: "",
      link: "",
      email: "",
      password: "",
      db_table: "",
      video_link: "",
      remark: "Pending",
    };

    try {
      console.log("Sending to API:", newRow);
      const response = await fetch(`${API_URL}/knowledge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRow),
      });

      console.log("Response status:", response.status);
      const result = await response.json();
      console.log("Result:", result);

      if (result.success) {
        alert("✅ Row added successfully!");
        fetchData();
      } else {
        alert("❌ Error: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error adding row:", error);
      alert("❌ Connection failed: " + error.message);
    }
  };

  const handleEditClick = (row) => {
    setEditingId(row.id);
    setEditData({ ...row });
  };

  const handleSave = async () => {
    try {
      console.log("Saving data:", editData);
      const response = await fetch(`${API_URL}/knowledge/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      console.log("Save response status:", response.status);
      const result = await response.json();
      console.log("Save result:", result);

      if (result.success) {
        alert("✅ Row saved successfully!");
        setEditingId(null);
        fetchData();
      } else {
        alert("❌ Error: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error saving row:", error);
      alert("❌ Connection failed: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    const password = prompt("🔒 Enter Team Leader Password to confirm deletion:");
    if (!password) return;

    try {
      // Verify delete password first (flexible endpoint)
      const verifyResponse = await fetch(`${API_URL}/auth/verify-delete-password-flex`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const verifyResult = await verifyResponse.json();
      if (!verifyResult.success) {
        alert("❌ " + (verifyResult.message || "Invalid password"));
        return;
      }

      // If password is correct, proceed with deletion
      const response = await fetch(`${API_URL}/knowledge/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (result.success) {
        alert("✅ Row deleted successfully!");
        fetchData();
      }
    } catch (error) {
      console.error("Error deleting row:", error);
      alert("❌ Connection failed: " + error.message);
    }
  };

  const handleFileUpload = async (e, fileType) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.path) {
        setEditData({
          ...editData,
          [fileType]: result.path,
        });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setEditData({
      ...editData,
      [field]: value,
    });
  };

  const getDownloadUrl = (filePath) => {
    if (!filePath) return null;
    const filename = filePath.split('/').pop();
    return `${API_URL}/knowledge/download/${filename}`;
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      brand: "",
      channel: "",
      email: "",
      db_table: "",
      remark: "",
      has_python_file: "",
      has_extra_file: "",
      has_video: "",
    });
  };

  const filteredRows = rows.filter((row) => {
    const s = filters.search.toLowerCase();
    if (s && ![row.brand, row.channel, row.link, row.email, row.db_table]
      .some((v) => (v || "").toLowerCase().includes(s))) return false;
    if (filters.brand && !(row.brand || "").toLowerCase().includes(filters.brand.toLowerCase())) return false;
    if (filters.channel && !(row.channel || "").toLowerCase().includes(filters.channel.toLowerCase())) return false;
    if (filters.email && !(row.email || "").toLowerCase().includes(filters.email.toLowerCase())) return false;
    if (filters.db_table && !(row.db_table || "").toLowerCase().includes(filters.db_table.toLowerCase())) return false;
    if (filters.remark && row.remark !== filters.remark) return false;
    if (filters.has_python_file === "yes" && !row.python_file) return false;
    if (filters.has_python_file === "no" && row.python_file) return false;
    if (filters.has_extra_file === "yes" && !row.extra_file) return false;
    if (filters.has_extra_file === "no" && row.extra_file) return false;
    if (filters.has_video === "yes" && !row.video_link) return false;
    if (filters.has_video === "no" && row.video_link) return false;
    return true;
  });

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  if (isLoading) {
    return <div style={{ textAlign: "center", padding: "20px" }}>Loading...</div>;
  }

  return (
    <div className="table-container">
      <div className="table-header">
        <h2>Knowledge Base - {employee}</h2>
        <div className="header-actions">
          <button onClick={() => setShowFilters((v) => !v)} className="btn-filter">
            🔍 Filters {activeFilterCount > 0 && <span className="filter-badge">{activeFilterCount}</span>}
          </button>
          <button onClick={handleAddRow} className="btn-add">
            + Add New Row
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="filter-panel">
          <div className="filter-row">
            <div className="filter-group filter-group-wide">
              <label>Search All</label>
              <input
                type="text"
                placeholder="Search brand, channel, link, email, db table..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="filter-input"
              />
            </div>
          </div>
          <div className="filter-row">
            <div className="filter-group">
              <label>Brand</label>
              <input type="text" placeholder="Filter brand..." value={filters.brand}
                onChange={(e) => handleFilterChange("brand", e.target.value)} className="filter-input" />
            </div>
            <div className="filter-group">
              <label>Channel</label>
              <input type="text" placeholder="Filter channel..." value={filters.channel}
                onChange={(e) => handleFilterChange("channel", e.target.value)} className="filter-input" />
            </div>
            <div className="filter-group">
              <label>Email</label>
              <input type="text" placeholder="Filter email..." value={filters.email}
                onChange={(e) => handleFilterChange("email", e.target.value)} className="filter-input" />
            </div>
            <div className="filter-group">
              <label>DB Table</label>
              <input type="text" placeholder="Filter db table..." value={filters.db_table}
                onChange={(e) => handleFilterChange("db_table", e.target.value)} className="filter-input" />
            </div>
            <div className="filter-group">
              <label>Remark</label>
              <select value={filters.remark} onChange={(e) => handleFilterChange("remark", e.target.value)} className="filter-input">
                <option value="">All</option>
                <option>Pending</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Python File</label>
              <select value={filters.has_python_file} onChange={(e) => handleFilterChange("has_python_file", e.target.value)} className="filter-input">
                <option value="">All</option>
                <option value="yes">Has File</option>
                <option value="no">No File</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Extra File</label>
              <select value={filters.has_extra_file} onChange={(e) => handleFilterChange("has_extra_file", e.target.value)} className="filter-input">
                <option value="">All</option>
                <option value="yes">Has File</option>
                <option value="no">No File</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Video</label>
              <select value={filters.has_video} onChange={(e) => handleFilterChange("has_video", e.target.value)} className="filter-input">
                <option value="">All</option>
                <option value="yes">Has Video</option>
                <option value="no">No Video</option>
              </select>
            </div>
          </div>
          <div className="filter-footer">
            <span className="filter-count">{filteredRows.length} of {rows.length} records</span>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="btn-clear-filters">✕ Clear Filters</button>
            )}
          </div>
        </div>
      )}

      <div className="table-wrapper">
        <table className="knowledge-table">
          <thead>
            <tr>
              <th>Brand</th>
              <th>Channel</th>
              <th>Link</th>
              <th>Email</th>
              <th>Password</th>
              <th>DB Table Name</th>
              <th>Python File</th>
              <th>Extra File</th>
              <th>Video Guide</th>
              <th>Remark</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr key={row.id} className={`row-${row.remark.toLowerCase()}`}>
                {editingId === row.id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        value={editData.brand || ""}
                        onChange={(e) => handleInputChange("brand", e.target.value)}
                        className="cell-input"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editData.channel || ""}
                        onChange={(e) => handleInputChange("channel", e.target.value)}
                        className="cell-input"
                        placeholder="e.g., Email, Slack, Teams"
                      />
                    </td>
                    <td>
                      <input
                        type="url"
                        value={editData.link || ""}
                        onChange={(e) => handleInputChange("link", e.target.value)}
                        className="cell-input"
                        placeholder="https://example.com"
                      />
                    </td>
                    <td>
                      <input
                        type="email"
                        value={editData.email || ""}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="cell-input"
                        placeholder="user@example.com"
                      />
                    </td>
                    <td>
                      <input
                        type="password"
                        value={editData.password || ""}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="cell-input"
                        placeholder="password"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editData.db_table || ""}
                        onChange={(e) => handleInputChange("db_table", e.target.value)}
                        className="cell-input"
                      />
                    </td>
                    <td>
                      <div className="file-input-wrapper">
                        <input
                          type="file"
                          accept=".py"
                          onChange={(e) => handleFileUpload(e, "python_file")}
                          className="file-input"
                        />
                        {editData.python_file && (
                          <a href={getDownloadUrl(editData.python_file)} download className="file-link">
                            📄 Download
                          </a>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="file-input-wrapper">
                        <input
                          type="file"
                          onChange={(e) => handleFileUpload(e, "extra_file")}
                          className="file-input"
                        />
                        {editData.extra_file && (
                          <a href={getDownloadUrl(editData.extra_file)} download className="file-link">
                            📄 Download
                          </a>
                        )}
                      </div>
                    </td>
                    <td>
                      <input
                        type="url"
                        value={editData.video_link || ""}
                        onChange={(e) => handleInputChange("video_link", e.target.value)}
                        className="cell-input"
                        placeholder="https://youtube.com/..."
                      />
                    </td>
                    <td>
                      <select
                        value={editData.remark || "Pending"}
                        onChange={(e) => handleInputChange("remark", e.target.value)}
                        className="cell-select"
                      >
                        <option>Pending</option>
                        <option>In Progress</option>
                        <option>Done</option>
                      </select>
                    </td>
                    <td>
                      <button onClick={handleSave} className="btn-save">
                        ✓ Save
                      </button>
                      <button onClick={() => setEditingId(null)} className="btn-cancel">
                        ✕ Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{row.brand}</td>
                    <td>{row.channel || "—"}</td>
                    <td>
                      {row.link && (
                        <a href={row.link} target="_blank" rel="noopener noreferrer" className="table-link">
                          🔗 Link
                        </a>
                      )}
                    </td>
                    <td className="email-cell">{row.email || "—"}</td>
                    <td className="password-cell">{'•'.repeat((row.password || "").length) || "—"}</td>
                    <td>{row.db_table}</td>
                    <td>
                      {row.python_file && (
                        <a href={getDownloadUrl(row.python_file)} download className="file-link">
                          📄 .py
                        </a>
                      )}
                    </td>
                    <td>
                      {row.extra_file && (
                        <a href={getDownloadUrl(row.extra_file)} download className="file-link">
                          📎 File
                        </a>
                      )}
                    </td>
                    <td>
                      {row.video_link && (
                        <a href={row.video_link} target="_blank" rel="noopener noreferrer" className="video-link">
                          ▶️ Video
                        </a>
                      )}
                    </td>
                    <td>
                      <span className={`badge badge-${row.remark.toLowerCase()}`}>
                        {row.remark}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button onClick={() => handleEditClick(row)} className="btn-edit">
                          ✏️ Edit
                        </button>
                        <button onClick={() => handleDelete(row.id)} className="btn-delete">
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length === 0 && !isLoading && (
        <div className="empty-state">
          <p>No knowledge records yet. Add one to get started!</p>
        </div>
      )}
      {rows.length > 0 && filteredRows.length === 0 && (
        <div className="empty-state">
          <p>No records match the current filters.</p>
        </div>
      )}
    </div>
  );
}
