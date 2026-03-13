const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();

/* IMPORT DATABASE */
const db = require("./db/db");

/* IMPORT ROUTES */
const authRoutes = require("./routes/auth");
const knowledgeRoutes = require("./routes/knowledge");
const teamRoutes = require("./routes/team");

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());

/* STATIC FOLDER FOR FILES */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* MULTER CONFIG */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* FILE UPLOAD API */
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  res.json({
    path: `/uploads/${req.file.filename}`,
  });
});

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/knowledge", knowledgeRoutes);
app.use("/team", teamRoutes);

/* SERVER */
const DEFAULT_PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8000;

// Try listening on a port, and if it's in use try the next one (up to maxAttempts)
function listenWithRetry(startPort, maxAttempts = 5) {
  let attempts = 0;

  function tryPort(port) {
    const server = app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

    server.on('error', (err) => {
      if (err && err.code === 'EADDRINUSE') {
        attempts += 1;
        console.warn(`Port ${port} in use, trying port ${port + 1}... (${attempts}/${maxAttempts})`);
        if (attempts < maxAttempts) {
          setTimeout(() => tryPort(port + 1), 200);
        } else {
          console.error(`Unable to bind to a port after ${maxAttempts} attempts. Exiting.`);
          process.exit(1);
        }
      } else {
        console.error('Server error:', err);
        process.exit(1);
      }
    });
  }

  tryPort(startPort);
}

listenWithRetry(DEFAULT_PORT, 10);