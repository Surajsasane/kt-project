const express = require("express");
const router = express.Router();
const db = require("../db/db");

/* LOGIN */
router.post("/login", (req, res) => {
  const { login_id, password } = req.body;

  if (!login_id || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing credentials",
    });
  }

  db.get(
    "SELECT * FROM users WHERE login_id=? AND password=?",
    [login_id, password],
    (err, user) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Database error",
        });
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      res.json({
        success: true,
        user: {
          id: user.id,
          login_id: user.login_id,
        },
      });
    }
  );
});

//////////////////////////////////////////////////////////////
/* VERIFY DELETE PASSWORD */
//////////////////////////////////////////////////////////////

router.post("/verify-delete-password", (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      success: false,
      message: "Password required",
    });
  }
  // Ensure `delete_password` column exists; if not, attempt to add with default
  db.all("PRAGMA table_info(users)", [], (pragmaErr, cols) => {
    if (pragmaErr) {
      console.error('PRAGMA error:', pragmaErr);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    const hasDeleteCol = Array.isArray(cols) && cols.some((c) => c.name === 'delete_password');
    const maybeAddColumn = (cb) => {
      if (hasDeleteCol) return cb();
      // Try to add the column with a safe default
      db.run("ALTER TABLE users ADD COLUMN delete_password TEXT DEFAULT 'leader123'", (addErr) => {
        if (addErr) console.error('Failed to add delete_password column:', addErr.message);
        else console.log('Added delete_password column to users table');
        // continue regardless of addErr; verification will handle missing data
        return cb();
      });
    };

    maybeAddColumn(() => {
      // Try to verify against stored delete_password (if present)
      db.get("SELECT delete_password FROM users WHERE delete_password = ? LIMIT 1", [password], (getErr, row) => {
        if (getErr) {
          console.error('DB error verifying delete password:', getErr.message);
          return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (row) return res.json({ success: true, message: 'Password verified' });

        // Fallback: if no stored match, check default literal value
        // (useful for older DBs where column may be missing or empty)
        const DEFAULT_LEADER = 'leader123';
        if (password === DEFAULT_LEADER) return res.json({ success: true, message: 'Password verified (default)' });

        return res.status(401).json({ success: false, message: 'Invalid delete password' });
      });
    });
  });
});

module.exports = router;

// Flexible verification endpoint that accepts JSON, form-encoded, or raw text
router.post('/verify-delete-password-flex', express.text({ type: '*/*' }), (req, res) => {
  let password = null;
  const raw = req.body;

  console.log('verify-delete-password-flex received body type=', typeof raw, 'value=', (typeof raw === 'object' ? JSON.stringify(raw) : String(raw)).slice(0,200));

  // If body was already parsed by express.json() it will be an object
  if (raw && typeof raw === 'object') {
    if (raw.password) password = raw.password;
  } else {
    // Try parse as JSON when raw is a string
    try {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.password) password = parsed.password;
    } catch (e) {
      // not JSON
    }

    // If not JSON, try urlencoded form: password=...
    if (!password && typeof raw === 'string') {
      const m = raw.match(/password=([^&]+)/);
      if (m) password = decodeURIComponent(m[1]);
    }

    // If still not found, treat entire body as password
    if (!password && typeof raw === 'string') {
      password = raw.trim();
    }
  }

  // If not JSON, try urlencoded form: password=...
  if (!password && typeof raw === 'string') {
    const m = raw.match(/password=([^&]+)/);
    if (m) password = decodeURIComponent(m[1]);
  }

  // If still not found, treat entire body as password
  if (!password && typeof raw === 'string') {
    password = raw.trim();
  }

  if (!password) return res.status(400).json({ success: false, message: 'Password required' });

  // Verify using same logic as main route: check DB or default
  db.all("PRAGMA table_info(users)", [], (pragmaErr, cols) => {
    if (pragmaErr) {
      console.error('PRAGMA error:', pragmaErr);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    const hasDeleteCol = Array.isArray(cols) && cols.some((c) => c.name === 'delete_password');
    const cb = () => {
      db.get("SELECT delete_password FROM users WHERE delete_password = ? LIMIT 1", [password], (getErr, row) => {
        if (getErr) {
          console.error('DB error verifying delete password:', getErr.message);
          return res.status(500).json({ success: false, message: 'Database error' });
        }
        if (row) return res.json({ success: true, message: 'Password verified' });
        const DEFAULT_LEADER = 'leader123';
        if (password === DEFAULT_LEADER) return res.json({ success: true, message: 'Password verified (default)' });
        return res.status(401).json({ success: false, message: 'Invalid delete password' });
      });
    };

    if (!hasDeleteCol) {
      db.run("ALTER TABLE users ADD COLUMN delete_password TEXT DEFAULT 'leader123'", (addErr) => {
        if (addErr) console.error('Failed to add delete_password column:', addErr.message);
        else console.log('Added delete_password column to users table');
        cb();
      });
    } else cb();
  });
});