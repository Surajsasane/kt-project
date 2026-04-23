const path = require("path");

// Use /tmp for Vercel serverless functions (writable), current dir for local
const dbPath = process.env.VERCEL ? path.join("/tmp", "database.db") : "database.db";

const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error(err.message);
  else console.log("Connected to SQLite database.");
});

// Promisified helpers
function allAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)));
  });
}

function runAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve(this);
    });
  });
}

async function ensureColumn(table, column, definition) {
  try {
    const rows = await allAsync(`PRAGMA table_info(${table})`);
    const exists = rows.some((r) => r.name === column);
    if (!exists) {
      console.log(`Adding column ${column} to ${table}`);
      await runAsync(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
    }
  } catch (err) {
    console.error(`Error ensuring column ${column} on ${table}:`, err.message);
  }
}

(async () => {
  try {
    // Create base tables if missing
    await runAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        login_id TEXT UNIQUE,
        password TEXT
      )
    `);

    await runAsync(`
      CREATE TABLE IF NOT EXISTS team_members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await runAsync(`
      CREATE TABLE IF NOT EXISTS knowledge (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee TEXT NOT NULL,
        brand TEXT,
        link TEXT,
        email TEXT,
        password TEXT,
        db_table TEXT,
        python_file TEXT,
        extra_file TEXT,
        video_link TEXT,
        remark TEXT DEFAULT 'Pending'
      )
    `);

    // Ensure new columns exist on existing DBs
    await ensureColumn('users', 'delete_password', "TEXT DEFAULT 'leader123'");
    await ensureColumn('knowledge', 'channel', "TEXT DEFAULT ''");
    await ensureColumn('knowledge', 'created_at', "DATETIME DEFAULT CURRENT_TIMESTAMP");
    await ensureColumn('knowledge', 'updated_at', "DATETIME DEFAULT CURRENT_TIMESTAMP");

    // Insert default admin if missing, update credentials if they exist
    await runAsync(`INSERT OR IGNORE INTO users (id, login_id, password, delete_password) VALUES (1, 'Trailytics@Admin', 'Trailytics@Admin@2026', 'leader123')`);
    await runAsync(`UPDATE users SET login_id='Trailytics@Admin', password='Trailytics@Admin@2026' WHERE id=1`);

    // Seed default team members if table empty
    const teamRows = await allAsync(`SELECT COUNT(*) as cnt FROM team_members`);
    if (teamRows[0].cnt === 0) {
      const defaultTeamMembers = ['John Smith', 'Sarah Johnson', 'Mike Davis', 'Emma Wilson'];
      for (const member of defaultTeamMembers) {
        await runAsync(`INSERT OR IGNORE INTO team_members (name) VALUES (?)`, [member]);
      }
    }

    // Seed sample knowledge rows if none exist
    const knowRows = await allAsync(`SELECT COUNT(*) as cnt FROM knowledge`);
    if (knowRows[0].cnt === 0) {
      const employees = ['John Smith', 'Sarah Johnson', 'Mike Davis', 'Emma Wilson'];
      for (const employee of employees) {
        await runAsync(
          `INSERT OR IGNORE INTO knowledge (employee, brand, channel, link, email, password, db_table, remark) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [employee, 'Sample Brand', 'Email', 'https://example.com', 'user@example.com', 'password123', 'sample_table', 'Pending']
        );
      }
    }

    console.log('Database ready.');
  } catch (err) {
    console.error('Database initialization error:', err.message);
  }
})();

module.exports = db;
