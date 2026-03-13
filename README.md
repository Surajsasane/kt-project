# Employee Knowledge Management System

A full-stack web application for managing employee knowledge, tasks, and documentation in an organization.

## Features

✨ **Complete Feature Set:**
- 🔐 Secure login authentication
- 👥 4 Employee management tabs with individual knowledge bases
- 📊 Excel-like editable data table with unlimited rows
- 📁 File upload support (Python files & extra files)
- 🎥 Video guide links for task documentation
- 📝 Task status tracking (Done, Pending, In Progress)
- 🔗 Clickable links for URLs and resources
- 💾 Real-time database synchronization
- 📱 Responsive and modern UI
- 🎨 Professional dashboard with smooth animations

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool & dev server
- **CSS3** - Modern styling with animations

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **SQLite3** - Database
- **Multer** - File upload handling
- **CORS** - Cross-origin requests

## Project Structure

```
kt project/
├── frontend/
│   ├── src/
│   │   ├── app.jsx              # Main app component with login
│   │   ├── main.jsx             # React entry point
│   │   ├── index.css            # Global styles
│   │   ├── components/
│   │   │   └── KnowledgeTable.jsx   # Main data table
│   │   ├── pages/
│   │   │   └── Dashboard.jsx    # Dashboard with tabs
│   │   └── styles/
│   │       ├── dashboard.css    # Dashboard styling
│   │       └── table.css        # Table styling
│   ├── package.json
│   └── index.html
└── backend/
    ├── server.js                # Express server
    ├── package.json
    ├── database.db              # SQLite database
    ├── db/
    │   └── db.js               # Database setup
    ├── routes/
    │   ├── auth.js             # Authentication endpoints
    │   └── knowledge.js        # Knowledge base CRUD
    ├── uploads/                # File storage
    └── __pycache__/
```

## Installation & Setup

### Prerequisites
- Node.js 14+ 
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
npm start
```

Server runs on: `http://localhost:8000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Application runs on: `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /auth/login` - User login

### Knowledge Base
- `GET /knowledge/:employee` - Get all records for an employee
- `POST /knowledge` - Add new knowledge record
- `PUT /knowledge/:id` - Update knowledge record
- `DELETE /knowledge/:id` - Delete knowledge record
- `POST /upload` - Upload file

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  login_id TEXT UNIQUE,
  password TEXT
)
```

### Knowledge Table
```sql
CREATE TABLE knowledge (
  id INTEGER PRIMARY KEY,
  employee TEXT NOT NULL,
  brand TEXT,
  link TEXT,
  email_password TEXT,
  db_table TEXT,
  python_file TEXT,
  extra_file TEXT,
  video_link TEXT,
  remark TEXT DEFAULT 'Pending',
  created_at DATETIME,
  updated_at DATETIME
)
```

## Default Login Credentials

**Username:** `admin`  
**Password:** `admin123`

## Features in Detail

### 1. Login Page
- Modern gradient design
- Input validation
- Loading state with spinner
- Professional UI

### 2. Dashboard
- Employee tab selection (4 employees)
- Clean header with logout button
- Responsive layout

### 3. Knowledge Table
- **Columns:**
  - Brand: Product/service name
  - Link: Web URL (clickable)
  - Email/Password: Credentials
  - Database Table Name: Related DB table
  - Python File: Upload/download Python scripts
  - Extra File: Additional files
  - Video Guide: Training video links
  - Remark: Status (Done/Pending/In Progress)
  - Actions: Edit/Delete buttons

### 4. CRUD Operations
- **Add:** "+ Add New Row" button
- **Edit:** Click "✏️ Edit" to modify any row
- **Delete:** Click "🗑️ Delete" with confirmation
- **Save:** Changes are persisted to SQLite

### 5. File Upload
- Upload Python files (.py)
- Store files securely in /uploads
- Download links in table
- File paths saved in database

## Usage

1. **Login**
   - Enter credentials: admin / admin123
   - Click "Access System"

2. **Select Employee**
   - Choose from 4 employee tabs
   - View employee-specific knowledge base

3. **Add Record**
   - Click "+ Add New Row"
   - Fill in fields or leave empty
   - Click "✏️ Edit" to modify

4. **Update Record**
   - Click "✏️ Edit" button
   - Modify any field
   - Upload files if needed
   - Click "✓ Save"

5. **Delete Record**
   - Click "🗑️ Delete"
   - Confirm deletion

6. **Manage Files**
   - Click file input to upload
   - Python scripts and extra files supported
   - Download via links in table

7. **Track Status**
   - Set remark: Done, Pending, or In Progress
   - Color-coded badges for visual tracking
   - Filter by status visually

## Styling Features

- **Modern Design:** Gradient backgrounds, smooth transitions
- **Color Scheme:**
  - Primary: Purple (#667eea)
  - Secondary: Pink (#764ba2)
  - Success: Green (#10b981)
  - Warning: Orange (#f59e0b)
  - Danger: Red (#ef4444)

- **Responsive:** Works on desktop, tablet, mobile
- **Animations:** Hover effects, loading spinners, smooth transitions
- **Accessibility:** Clear labels, proper contrast, keyboard navigation

## Error Handling

- Database errors logged
- User-friendly error messages
- File upload validation
- Form input validation
- Network error handling

## File Upload Limits

- File types: Any (Python files recommended)
- Max file size: Limited by multer config
- Storage: Local /uploads folder

## Future Enhancements

- User roles and permissions
- Search and filter functionality
- Bulk operations
- Employee performance metrics
- Export to Excel
- Dark mode theme
- Email notifications
- Comment system
- Version control for files
- Task assignment workflows

## Troubleshooting

### Frontend won't start
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npm run dev
```

### Backend won't connect
- Ensure backend is running on port 8000
- Check database file exists
- Verify CORS is enabled

### Files not uploading
- Check /uploads folder exists
- Verify multer configuration
- Check file permissions

### Login fails
- Verify credentials: admin/admin123
- Check database has default user
- Look at browser console for errors

## License

MIT License - Feel free to use this project

## Support

For issues or questions, please check the console logs and ensure:
1. Backend is running on port 8000
2. Frontend is running on port 5173
3. Database file has correct permissions
4. /uploads folder exists and is writable

---

**Version:** 1.0.0  
**Last Updated:** February 2026  
**Status:** Production Ready ✅
