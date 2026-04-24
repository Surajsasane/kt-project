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
app.use(cors({
  origin: ['https://trailytics-workflows-continuity.onrender.com', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

/* HEALTH CHECK ENDPOINT */
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

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

/* ERROR HANDLING MIDDLEWARE */
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

/* 404 HANDLER */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found"
  });
});

/* SERVER */
const DEFAULT_PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8000;

// For Vercel deployment, export the app
module.exports = app;

// For local development, listen on port
if (require.main === module) {
  app.listen(DEFAULT_PORT, () => {
    console.log(`Server running on port ${DEFAULT_PORT}`);
    console.log(`Health check available at: http://localhost:${DEFAULT_PORT}/health`);
  });
}