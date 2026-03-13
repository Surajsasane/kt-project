const express = require("express");
const router = express.Router();
const db = require("../db/db");

//////////////////////////////////////////////////////////////
/* GET ALL TEAM MEMBERS */
//////////////////////////////////////////////////////////////

router.get("/", (req, res) => {
  db.all(
    "SELECT id, name FROM team_members ORDER BY id ASC",
    (err, rows) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }
      res.json(rows);
    }
  );
});

//////////////////////////////////////////////////////////////
/* ADD NEW TEAM MEMBER */
//////////////////////////////////////////////////////////////

router.post("/", (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ success: false, message: "Team member name is required" });
  }

  db.run(
    "INSERT INTO team_members (name) VALUES (?)",
    [name.trim()],
    function (err) {
      if (err) {
        if (err.message.includes("UNIQUE constraint failed")) {
          return res.status(400).json({ success: false, message: "Team member already exists" });
        }
        return res.status(500).json({ success: false, message: err.message });
      }

      res.json({
        success: true,
        id: this.lastID,
        name: name.trim(),
      });
    }
  );
});

//////////////////////////////////////////////////////////////
/* UPDATE TEAM MEMBER NAME */
//////////////////////////////////////////////////////////////

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ success: false, message: "Team member name is required" });
  }

  db.run(
    "UPDATE team_members SET name=? WHERE id=?",
    [name.trim(), id],
    function (err) {
      if (err) {
        if (err.message.includes("UNIQUE constraint failed")) {
          return res.status(400).json({ success: false, message: "Team member name already exists" });
        }
        return res.status(500).json({ success: false, message: err.message });
      }

      res.json({ success: true });
    }
  );
});

//////////////////////////////////////////////////////////////
/* DELETE TEAM MEMBER */
//////////////////////////////////////////////////////////////

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.run(
    "DELETE FROM team_members WHERE id=?",
    [id],
    function (err) {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }

      res.json({ success: true });
    }
  );
});

module.exports = router;
