# 🚀 Quick Start - Run in 5 Minutes

## Prerequisites Check ✅

Before starting, make sure you have:
- [ ] Node.js installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Two terminal windows open

---

## Step 1: Start Backend Server (Terminal 1)

```bash
cd backend
npm install
node server.js
```

**Expected Output:**
```
Connected to SQLite database.
Server running on port 8000
```

✅ **Backend is ready!**

---

## Step 2: Start Frontend (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

**Expected Output:**
```
✓ ready in xxx ms
➜  Local:   http://localhost:5173/
```

✅ **Frontend is ready!**

---

## Step 3: Open Application

**Click the link or open in browser:**
```
http://localhost:5173
```

---

## Step 4: Login

**Enter credentials:**
```
Username: admin
Password: admin123
```

Click **"Access System"**

---

## Step 5: Try It Out! 🎉

### What You Can Do:

1. **View Employees Tab**
   - See 4 employee buttons: John Smith, Sarah Johnson, Mike Davis, Emma Wilson
   - Click to switch between employees

2. **Add Record**
   - Click **"+ Add New Row"**
   - Fill in the form that appears
   - Click **"✓ Save"**

3. **Edit Record**
   - Click **"✏️ Edit"** on any row
   - Modify fields
   - Upload files if needed
   - Click **"✓ Save"**

4. **Delete Record**
   - Click **"🗑️ Delete"** on any row
   - Confirm deletion

5. **Upload File**
   - During edit, click file input in Python File column
   - Select a file from your computer
   - Click "✓ Save" to store the path

6. **View Links**
   - Click 🔗 links in "Link" column (opens in new tab)
   - Click 🎥 "Video" links
   - Click 📄 file download links

---

## 📊 Sample Workflow

```
1. Login Page
   ↓
2. Click "John Smith" tab
   ↓
3. See sample records in table
   ↓
4. Click "✏️ Edit" on first row
   ↓
5. Change Brand name to "My Project"
   ↓
6. Upload a Python file
   ↓
7. Click "✓ Save"
   ↓
8. See updated row in table
   ↓
9. Click "🗑️ Delete" to remove
   ↓
10. Click "+ Add New Row" to create new
```

---

## 💾 Data Storage

- **Database**: `backend/database.db` (SQLite)
- **Files**: `backend/uploads/` folder
- **Data Persists**: Even after restart!

---

## 🆘 Troubleshooting

### Issue: Port 8000 Already in Use

**Solution:**
```bash
# Find process on port 8000
netstat -ano | findstr :8000

# Kill process (replace PID with number from above)
taskkill /PID [PID] /F
```

### Issue: Port 5173 Already in Use

Vite will automatically use the next available port (5174, 5175, etc.)

### Issue: Can't Connect to Backend

- Verify backend is running: `http://localhost:8000`
- Should show a GET response
- If not, restart backend server

### Issue: Database Locked

```bash
# Delete old database
cd backend
rm database.db

# Restart server
node server.js
```

---

## 📝 File Locations

```
Frontend Files:
- frontend/src/app.jsx (Login page)
- frontend/src/pages/Dashboard.jsx (Main dashboard)
- frontend/src/components/KnowledgeTable.jsx (Data table)

Backend Files:
- backend/server.js (Main server)
- backend/routes/knowledge.js (Data routes)
- backend/db/db.js (Database)

Database:
- backend/database.db (Auto-created)

Uploads:
- backend/uploads/ (File storage)
```

---

## 🔄 Complete Workflow

```
BROWSER                          BACKEND                    DATABASE
═════════════════════════════════════════════════════════════════

1. Visit localhost:5173
   └──────→ React app loads
   
2. Enter admin/admin123
   └──────→ POST /auth/login ──────→ Check credentials
                    ← Response: success
   
3. Click John Smith
   └──────→ GET /knowledge/John Smith ──────→ Query database
                    ← Response: [rows]
   
4. Click "+ Add New Row"
   └──────→ Form appears (client-side)
   
5. Fill form & click Save
   └──────→ POST /knowledge ──────→ INSERT new row
                    ← Response: {id, success}
   
6. Table refreshes
   └──────→ GET /knowledge/John Smith ──────→ Query updated data
                    ← Response: [rows with new entry]
```

---

## 🎯 Default Credentials

| Field | Value |
|-------|-------|
| **Username** | admin |
| **Password** | admin123 |

(Change in production!)

---

## ✨ Features at a Glance

| Feature | Where | How |
|---------|-------|-----|
| Add Record | "+ Add New Row" button | Fill form and save |
| Edit Record | "✏️ Edit" button | Modify fields and save |
| Delete Record | "🗑️ Delete" button | Click and confirm |
| Upload File | File input column | Select file and save |
| View Downloads | File links | Click link to download |
| View Videos | Video links | Click play button |
| Check Status | Remark column | See Done/Pending/In Progress |
| Switch Employee | Tab buttons | Click new employee |

---

## 🎨 UI Color Guide

| Status | Color | Meaning |
|--------|-------|---------|
| **Done** | 🟢 Green | Completed task |
| **In Progress** | 🟡 Orange | Currently working |
| **Pending** | 🔴 Red | Not started |

---

## 📱 Access Methods

- **Desktop**: Full features visible
- **Tablet**: Responsive layout, horizontal scroll for tables
- **Mobile**: All features work, table scrolls horizontally

---

## 🔐 Security Tips

- Change default password after first login
- Don't share credentials publicly
- Uploaded files are accessible to anyone with link
- Use HTTPS in production

---

## 📧 Contact Support

If you encounter issues:

1. **Check Console**: F12 → Console tab
2. **Check Error Messages**: Red text in browser
3. **Check Terminal**: Error messages from backend
4. **Restart Both Servers**: Kill and restart both processes

---

## ✅ Success Checklist

After following these steps:

- [ ] Backend running on 8000 ✓
- [ ] Frontend running on 5173 ✓
- [ ] Can access app in browser ✓
- [ ] Can login with admin/admin123 ✓
- [ ] Can see employee tabs ✓
- [ ] Can add new row ✓
- [ ] Can edit existing row ✓
- [ ] Can delete row ✓
- [ ] Can upload file ✓
- [ ] Data saved to database ✓

**All checkmarks?** 🎉 **You're ready to present!**

---

## 🎓 Next Steps for Presentation

1. **Demo the System** (5 minutes)
   - Show login
   - Add sample record
   - Upload file
   - Show in table

2. **Explain Features** (5 minutes)
   - Employee tabs
   - Data fields
   - File management
   - Status tracking

3. **Show Documentation** (5 minutes)
   - Architecture
   - Database schema
   - API routes

4. **Q&A** (Open discussion)
   - Features
   - Customization
   - Scaling
   - Team on boarding

---

**Ready to impress your manager? You got this! 🚀**

For detailed information, check:
- README.md (All features)
- ARCHITECTURE.md (Technical details)
- PRESENTATION.md (Manager summary)
