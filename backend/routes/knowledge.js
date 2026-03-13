const express = require("express");
const router = express.Router();
const db = require("../db/db");
const multer = require("multer");
const path = require("path");

/* MULTER CONFIG FOR FILE UPLOADS */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });
const uploadFields = upload.fields([
  { name: 'python_file', maxCount: 1 },
  { name: 'extra_file', maxCount: 1 }
]);

//////////////////////////////////////////////////////////////
/* DOWNLOAD FILE - MUST BE BEFORE /:employee ROUTE */
//////////////////////////////////////////////////////////////

router.get("/download/:filename", (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, '../uploads/', filename);
  
  // Set content type based on file extension
  const ext = path.extname(filename).toLowerCase();
  let contentType = 'application/octet-stream';
  if (ext === '.py') contentType = 'text/plain';
  if (ext === '.pdf') contentType = 'application/pdf';
  if (ext === '.xlsx' || ext === '.xls') contentType = 'application/vnd.ms-excel';
  if (ext === '.csv') contentType = 'text/csv';
  
  res.setHeader('Content-Type', contentType);
  res.download(filepath, filename, (err) => {
    if (err) {
      console.error('Download error:', err);
      if (err.code === 'ENOENT') {
        res.status(404).json({ success: false, message: 'File not found' });
      }
    }
  });
});

//////////////////////////////////////////////////////////////
/* GET ALL ROWS FOR EMPLOYEE */
//////////////////////////////////////////////////////////////

router.get("/:employee", (req, res) => {
  const { employee } = req.params;

  db.all(
    "SELECT * FROM knowledge WHERE employee=? ORDER BY id DESC",
    [employee],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }

      res.json(rows);
    }
  );
});

//////////////////////////////////////////////////////////////
/* ADD NEW ROW WITH FILE UPLOAD */
//////////////////////////////////////////////////////////////

router.post("/", uploadFields, (req, res) => {
  const {
    employee,
    brand,
    channel,
    link,
    email,
    password,
    db_table,
    video_link,
    remark,
  } = req.body;

  // Handle file uploads
  const python_file = req.files?.python_file ? `/uploads/${req.files.python_file[0].filename}` : null;
  const extra_file = req.files?.extra_file ? `/uploads/${req.files.extra_file[0].filename}` : null;

  db.run(
    `INSERT INTO knowledge
    (employee, brand, channel, link, email, password, db_table, python_file, extra_file, video_link, remark)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      employee,
      brand || '',
      channel || '',
      link || '',
      email || '',
      password || '',
      db_table || '',
      python_file,
      extra_file,
      video_link || '',
      remark || 'Pending',
    ],
    function (err) {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }

      res.json({
        success: true,
        id: this.lastID,
      });
    }
  );
});

//////////////////////////////////////////////////////////////
/* UPDATE ROW WITH FILE UPLOAD */
//////////////////////////////////////////////////////////////

router.put("/:id", uploadFields, (req, res) => {
  const { id } = req.params;

  const {
    brand,
    channel,
    link,
    email,
    password,
    db_table,
    video_link,
    remark,
  } = req.body;

  // Handle file uploads (only if new files are uploaded)
  const python_file = req.files?.python_file ? `/uploads/${req.files.python_file[0].filename}` : req.body.python_file;
  const extra_file = req.files?.extra_file ? `/uploads/${req.files.extra_file[0].filename}` : req.body.extra_file;

  db.run(
    `UPDATE knowledge SET
      brand=?,
      channel=?,
      link=?,
      email=?,
      password=?,
      db_table=?,
      python_file=?,
      extra_file=?,
      video_link=?,
      remark=?
    WHERE id=?`,
    [
      brand || '',
      channel || '',
      link || '',
      email || '',
      password || '',
      db_table || '',
      python_file,
      extra_file,
      video_link || '',
      remark || 'Pending',
      id,
    ],
    (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }

      res.json({ success: true });
    }
  );
});

//////////////////////////////////////////////////////////////
/* DELETE ROW */
//////////////////////////////////////////////////////////////

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM knowledge WHERE id=?", [id], (err) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }

    res.json({ success: true });
  });
});

module.exports = router;