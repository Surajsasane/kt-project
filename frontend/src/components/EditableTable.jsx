import React, { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../config/api";

export default function EditableTable({ employee }) {
  const [rows, setRows] = useState([]);

//////////////////////////////////////////////////////////////
/* LOAD DATA */
//////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////
  /* LOAD DATA */
  //////////////////////////////////////////////////////////////

  useEffect(() => {
    fetchRows();
  }, [employee]);

  const fetchRows = async () => {
    try {
      const res = await axios.get(`${API_URL}/knowledge/${employee}`);
      setRows(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  //////////////////////////////////////////////////////////////
  /* ADD ROW */
  //////////////////////////////////////////////////////////////

  const addRow = async () => {
    try {
      await axios.post(`${API_URL}/knowledge`, {
        employee,
        brand: "",
        link: "",
        email_password: "",
        db_table: "",
        python_file: "",
        extra_file: "",
        video_link: "",
        remark: "Pending",
      });

      fetchRows();
    } catch (err) {
      console.error(err);
    }
  };

  //////////////////////////////////////////////////////////////
  /* UPDATE CELL */
  //////////////////////////////////////////////////////////////

  const updateCell = (id, field, value) => {
    const updatedRows = rows.map((row) =>
      row.id === id ? { ...row, [field]: value } : row
    );

    setRows(updatedRows);

    const updatedRow = updatedRows.find((r) => r.id === id);

    axios.put(`${API_URL}/knowledge/${id}`, updatedRow);
  };

  //////////////////////////////////////////////////////////////
  /* DELETE ROW */
  //////////////////////////////////////////////////////////////

  const deleteRow = async (id) => {
    try {
      await axios.delete(`${API_URL}/knowledge/${id}`);
      fetchRows();
    } catch (err) {
      console.error(err);
    }
  };

  //////////////////////////////////////////////////////////////
  /* FILE UPLOAD */
  //////////////////////////////////////////////////////////////

  const uploadFile = async (id, field, file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${API_URL}/upload`, formData);

      updateCell(id, field, res.data.path);
    } catch (err) {
      console.error(err);
    }
  };

  //////////////////////////////////////////////////////////////
  /* TABLE UI */
  //////////////////////////////////////////////////////////////

  const columns = [
    "brand",
    "link",
    "email_password",
    "db_table",
    "video_link",
    "remark",
  ];

  return (
    <div className="table-container">
      <div className="table-actions">
        <button onClick={addRow}>+ Add Row</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Brand</th>
            <th>Link</th>
            <th>Email / Password</th>
            <th>DB Table</th>
            <th>Python File</th>
            <th>Extra File</th>
            <th>Video Guide</th>
            <th>Remark</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              
              {/* Editable Text Columns */}
              {columns.map((field) => (
                <td
                  key={field}
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    updateCell(row.id, field, e.target.innerText)
                  }
                >
                  {field.includes("link") && row[field] ? (
                    <a href={`${API_URL}${row[field]}`} target="_blank">
                      {row[field]}
                    </a>
                  ) : (
                    row[field]
                  )}
                </td>
              ))}

              {/* Python File Upload */}
              <td>
                {row.python_file && (
                  <a
                    href={`${API_URL}${row.python_file}`}
                    target="_blank"
                  >
                    View File
                  </a>
                )}

                <input
                  type="file"
                  onChange={(e) =>
                    uploadFile(row.id, "python_file", e.target.files[0])
                  }
                />
              </td>

              {/* Extra File Upload */}
              <td>
                {row.extra_file && (
                  <a
                    href={`${API_URL}${row.extra_file}`}
                    target="_blank"
                  >
                    View File
                  </a>
                )}

                <input
                  type="file"
                  onChange={(e) =>
                    uploadFile(row.id, "extra_file", e.target.files[0])
                  }
                />
              </td>

              {/* Delete */}
              <td>
                <button onClick={() => deleteRow(row.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}