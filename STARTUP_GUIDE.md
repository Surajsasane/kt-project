# Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Start Backend Server

```bash
cd backend
node server.js
```

You should see:
```
Connected to SQLite database.
Server running on port 8000
```

### Step 2: Start Frontend Dev Server

In a new terminal:

```bash
cd frontend
npm run dev
```

You should see:
```
✓ ready in xxx ms
➜  Local:   http://localhost:5173/
```

### Step 3: Open in Browser

Open your browser and go to:
```
http://localhost:5173
```

### Step 4: Login

**Credentials:**
- Username: `admin`
- Password: `admin123`

### Step 5: Start Using

1. Select an employee tab (John Smith, Sarah Johnson, Mike Davis, or Emma Wilson)
2. Click "+ Add New Row" to create new knowledge records
3. Fill in the fields:
   - **Brand**: Product/service name
   - **Link**: URL to resource
   - **Email/Password**: Credentials needed
   - **DB Table Name**: Related database table
   - **Python File**: Upload .py scripts
   - **Extra File**: Upload documentation
   - **Video Guide**: Link to training video
   - **Remark**: Task status (Done/Pending/In Progress)

4. Click "✏️ Edit" to modify any row
5. Click "🗑️ Delete" to remove a row
6. Click "✓ Save" to update changes

---

## 📁 File Upload Guide

### Uploading Python Scripts

1. Click "✏️ Edit" on a row
2. In the "Python File" section, click the file input
3. Select a .py file from your computer
4. The file uploads to `/backend/uploads/`
5. Click "✓ Save" to store the link in database
6. Others can click "📄 .py" link to download

### Uploading Extra Files

1. Same process as Python files
2. Any file type supported
3. Click "✓ Save" to store link

---

## 🗂️ Key Folders

- `backend/` - Node.js server
- `frontend/` - React app
- `backend/uploads/` - Uploaded files stored here
- `backend/database.db` - SQLite database

---

## 🔧 Troubleshooting

### Port Already in Use

If port 8000 or 5173 is already in use:

**For Backend:**
```bash
# Edit backend/server.js and change PORT to 8001
```

**For Frontend:**
```bash
# Vite will automatically use next available port
```

### Database Error

If you get database errors:

```bash
# Delete old database
cd backend
rm database.db

# Restart server to recreate
node server.js
```

### Import Errors

```bash
# Reinstall dependencies
cd frontend
rm -rf node_modules
npm install
npm run dev
```

---

## 📊 Sample Data

When you first run the application, there's 1 sample row per employee:

| Field | Value |
|-------|-------|
| Brand | Sample Brand |
| Link | https://example.com |
| Email | user@example.com / password123 |
| DB Table | sample_table |
| Remark | Pending |

Edit or delete these sample rows as needed.

---

## 🔐 Security Notes

- Default password is `admin123` - **Change in production**
- Database stores passwords in plain text - Use hashing in production
- File uploads have no size limit - Add validation in production
- No authentication tokens - Add JWT in production

---

## 📱 Browser Support

- ✅ Chrome (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Edge (Latest)

Mobile browsers also supported!

---

## 💡 Tips

1. **Organizing Work**: Use different employees for different teams
2. **Status Tracking**: Use Remarks column to track progress
3. **Documentation**: Link videos for step-by-step guides
4. **File Management**: Upload important scripts for easy access
5. **Backup**: SQLite database saves automatically

---

## 🎓 Learn More

Check `README.md` for detailed documentation on:
- All API endpoints
- Database schema
- Feature list
- Tech stack details

---

**Ready to go! Happy knowledge sharing! 🎉**
