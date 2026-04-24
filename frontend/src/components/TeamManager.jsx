import React, { useState, useEffect } from "react";
import "../styles/team.css";
import API_URL from "../config/api";

export default function TeamManager({ onTeamUpdate }) {
  const [teamMembers, setTeamMembers] = useState([]);
  const [newMemberName, setNewMemberName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/team`);
      const data = await response.json();
      setTeamMembers(data || []);
      if (onTeamUpdate) onTeamUpdate(data);
    } catch (error) {
      console.error("Error fetching team members:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!newMemberName.trim()) {
      alert("❌ Please enter a team member name");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/team`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newMemberName }),
      });

      const result = await response.json();
      if (result.success) {
        alert("✅ Team member added!");
        setNewMemberName("");
        fetchTeamMembers();
      } else {
        alert("❌ Error: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error adding team member:", error);
      alert("❌ Connection failed: " + error.message);
    }
  };

  const handleEditStart = (id, name) => {
    setEditingId(id);
    setEditingName(name);
  };

  const handleEditSave = async (id) => {
    if (!editingName.trim()) {
      alert("❌ Name cannot be empty");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/team/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingName }),
      });

      const result = await response.json();
      if (result.success) {
        alert("✅ Name updated!");
        setEditingId(null);
        fetchTeamMembers();
      } else {
        alert("❌ Error: " + (result.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error updating team member:", error);
      alert("❌ Connection failed: " + error.message);
    }
  };

  const handleDelete = async (id, name) => {
    const password = prompt(`🔒 Enter Team Leader Password to delete "${name}":`);
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
      const response = await fetch(`${API_URL}/team/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (result.success) {
        alert("✅ Team member deleted!");
        fetchTeamMembers();
      }
    } catch (error) {
      console.error("Error deleting team member:", error);
      alert("❌ Connection failed: " + error.message);
    }
  };

  return (
    <div className="team-manager">
      <div className="team-header">
        <h3>👥 Team Members</h3>
      </div>

      <div className="add-member-form">
        <input
          type="text"
          value={newMemberName}
          onChange={(e) => setNewMemberName(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleAddMember()}
          placeholder="Enter new team member name"
          className="member-input"
        />
        <button onClick={handleAddMember} className="btn-add-member">
          + Add Member
        </button>
      </div>

      <div className="members-list">
        {teamMembers.map((member) => (
          <div key={member.id} className="member-item">
            {editingId === member.id ? (
              <>
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="member-edit-input"
                  autoFocus
                />
                <button
                  onClick={() => handleEditSave(member.id)}
                  className="btn-save-member"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="btn-cancel-member"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className="member-name">{member.name}</span>
                <button
                  onClick={() => handleEditStart(member.id, member.name)}
                  className="btn-edit-member"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(member.id, member.name)}
                  className="btn-delete-member"
                >
                  🗑️
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {teamMembers.length === 0 && !isLoading && (
        <p className="empty-message">No team members yet. Add one above!</p>
      )}
    </div>
  );
}
