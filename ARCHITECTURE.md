# System Architecture & Data Flow

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT SIDE (BROWSER)                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐                                            │
│  │   Login Page     │ ──────────────────┐                        │
│  └──────────────────┘                   │                        │
│                                         ▼                        │
│                                  ┌─────────────┐                 │
│                                  │ VALIDATION  │                 │
│                                  └─────────────┘                 │
│                                         │                        │
│         ┌───────────────────────────────┘                        │
│         ▼                                                         │
│  ┌──────────────────┐                                            │
│  │   Dashboard      │  (React Component)                         │
│  │  ├─ Tabs         │                                            │
│  │  ├─ Table        │                                            │
│  │  └─ File Upload  │                                            │
│  └──────────────────┘                                            │
│         │                                                         │
│         │ (HTTP/AXIOS)                                           │
│         ▼                                                         │
├─────────────────────────────────────────────────────────────────┤
│                      NETWORK BOUNDARY                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│           Port 8000 - localhost:8000 (Backend Server)            │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              EXPRESS.JS SERVER (Node.js)                │   │
│  │                                                          │   │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐   │   │
│  │  │ /auth       │  │ /knowledge   │  │ /upload      │   │   │
│  │  │ (Login)     │  │ (CRUD Ops)   │  │ (Files)      │   │   │
│  │  └─────────────┘  └──────────────┘  └──────────────┘   │   │
│  │         │                  │                 │           │   │
│  │         └──────────────────┼─────────────────┘           │   │
│  │                            ▼                             │   │
│  │                  ┌──────────────────┐                    │   │
│  │                  │  MIDDLEWARE      │                    │   │
│  │                  │  ├─ CORS         │                    │   │
│  │                  │  ├─ JSON Parser  │                    │   │
│  │                  │  └─ Multer       │                    │   │
│  │                  └──────────────────┘                    │   │
│  │                            │                             │   │
│  └────────────────────────────┼─────────────────────────────┘   │
│                               │                                  │
│     ┌─────────────────────────┘                                  │
│     ▼                                                             │
│  ┌──────────────────────────────────────────┐                    │
│  │        FILE SYSTEM (/uploads)            │                    │
│  │  ├─ python_scripts/                      │                    │
│  │  ├─ extra_files/                         │                    │
│  │  └─ ... other uploads                    │                    │
│  └──────────────────────────────────────────┘                    │
│     │                                                             │
│     ▼                                                             │
│  ┌──────────────────────────────────────────┐                    │
│  │     SQLite DATABASE (database.db)        │                    │
│  │  ┌────────────────────────────────────┐  │                    │
│  │  │ USERS TABLE                        │  │                    │
│  │  │ ├─ id (PK)                         │  │                    │
│  │  │ ├─ login_id (UNIQUE)               │  │                    │
│  │  │ └─ password                        │  │                    │
│  │  └────────────────────────────────────┘  │                    │
│  │  ┌────────────────────────────────────┐  │                    │
│  │  │ KNOWLEDGE TABLE                    │  │                    │
│  │  │ ├─ id (PK)                         │  │                    │
│  │  │ ├─ employee (FK)                   │  │                    │
│  │  │ ├─ brand, link, credentials        │  │                    │
│  │  │ ├─ db_table, remark                │  │                    │
│  │  │ ├─ python_file (path)              │  │ ◄──── File Paths   │
│  │  │ ├─ extra_file (path)               │  │       Stored       │
│  │  │ ├─ video_link                      │  │                    │
│  │  │ ├─ created_at, updated_at          │  │                    │
│  │  │ └─ ...                             │  │                    │
│  │  └────────────────────────────────────┘  │                    │
│  └──────────────────────────────────────────┘                    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Diagram

### 1. Login Flow

```
User Input         API Request          Database         Response
   │                  │                     │               │
   │──(username)──────│──/auth/login───────│               │
   │  (password)      │                     │               │
   │                  │     SELECT user     │               │
   │                  │    WHERE login_id   │               │
   │                  │<────────────────────│───────────────>│
   │                  │    match found      │   {success}    │
   │<─────────────────│◄──────────────────────────────────────│
   │(logged in)       │                     │               │
```

### 2. Fetch Knowledge Records

```
React Component    API Request          Database        Response
   │                  │                    │               │
   │────────────{"GET /knowledge/:employee"──────────────>│
   │                  │                    │               │
   │                  │ SELECT * FROM      │               │
   │                  │ knowledge WHERE    │               │
   │                  │ employee = ?       │               │
   │                  │<───────────────────│───────────────>│
   │                  │    Array of rows   │  JSON Array    │
   │<─────────────────────────────────────────────────────────│
   │(renders data)    │                    │               │
```

### 3. Add New Record

```
User Action        API Request          Database        Response
   │                  │                    │               │
   │─(fill form)─────>│──POST /knowledge──>│               │
   │                  │  {brand, link...}  │               │
   │                  │                    │ INSERT INTO   │
   │                  │                    │ knowledge     │
   │                  │                    │ VALUES (...)  │
   │                  │                    │<──(lastID)───>│
   │                  │ {success: true,    │               │
   │<─────────────────│  id: 123}          │               │
   │(refresh table)   │                    │               │
```

### 4. File Upload

```
User Uploads       → Multer        File System    Database
      File                ↓             ↓            ↓
        │         Middleware    /uploads/       Stores
        │         processes     folder           path
        │         file                           only
        └──────→ Generate    → Save with ──→ /uploads/
                random name    unique         123-script.py
                             filename
```

### 5. Edit & Update Record

```
User             Click Edit         Form Update      Database
   │                │                   │              │
   │────────────────│──────────────┐    │              │
   │  (modify       │              │    │              │
   │   fields)      │              └────>Inline Inputs│
   │                │              ▲     │              │
   │                │        User types  │              │
   │                │              │     │              │
   │────(Save)──────│──────────────┴────>PUT request   │
   │                │                    /knowledge/:id│
   │                │                    {...updated}  │
   │                │                    │              │
   │                │                    │ UPDATE       │
   │                │                    │ knowledge    │
   │                │                    │ SET ...      │
   │                │                    │              │
   │                │                    │<──Success────│
   │<───Refresh─────│◄────────────────────────────────│
   │   (new data)   │                    │              │
```

---

## 🔗 API Routes Overview

### Authentication
```
POST /auth/login
├─ Request: { login_id, password }
└─ Response: { success, message }
```

### Knowledge Base CRUD
```
GET /knowledge/:employee
└─ Returns: Array of records for employee

POST /knowledge
├─ Requires: Form data with fields + file upload
└─ Returns: { success, id }

PUT /knowledge/:id
├─ Requires: Updated field values + optional new files
└─ Returns: { success }

DELETE /knowledge/:id
└─ Returns: { success }
```

### File Upload
```
POST /upload
├─ Requires: Multipart form data with file
└─ Returns: { path: "/uploads/timestamp-filename" }
```

---

## 🗄️ Database Schema Details

### Users Table
```sql
┌─────────────────────────────┐
│ users                       │
├─────────────────────────────┤
│ id (INTEGER PRIMARY KEY)    │
│ login_id (TEXT UNIQUE)      │
│ password (TEXT)             │
└─────────────────────────────┘
```

### Knowledge Table
```sql
┌──────────────────────────────────────┐
│ knowledge                            │
├──────────────────────────────────────┤
│ id (INTEGER PRIMARY KEY)             │
│ employee (TEXT NOT NULL)             │ ← Links to employee name
│ brand (TEXT)                         │
│ link (TEXT)                          │
│ email_password (TEXT)                │
│ db_table (TEXT)                      │
│ python_file (TEXT)                   │ ← Stores file path
│ extra_file (TEXT)                    │ ← Stores file path
│ video_link (TEXT)                    │
│ remark (TEXT)                        │ ← Done/Pending/In Progress
│ created_at (DATETIME)                │
│ updated_at (DATETIME)                │
└──────────────────────────────────────┘
```

---

## 🔄 Request/Response Cycle

### Complete Example: Add New Knowledge Record

```
FRONTEND                          BACKEND                 DATABASE
════════════════════════════════════════════════════════════════

1. User clicks "Add New Row"
   ↓
2. Form appears with empty fields
   ↓
3. User fills:
   - Brand: React Components
   - Link: https://react.dev
   - Email/Password: user@domain / pass123
   - DB Table: components_db
   - Video: https://youtube.com/...
   - Remark: Pending
   ↓
4. User clicks "✏️ Edit" & uploads python_file
   ↓
5. Multer processes file
   ↓
   ├─ Generates: 1708592837-utils.py
   ├─ Saves to: /uploads/1708592837-utils.py
   ├─ Returns: { path: "/uploads/1708592837-utils.py" }
   ↓
6. Click "✓ Save"
   ↓
   POST http://localhost:8000/knowledge
   {
     "employee": "John Smith",
     "brand": "React Components",
     "link": "https://react.dev",
     "email_password": "user@domain / pass123",
     "db_table": "components_db",
     "python_file": "/uploads/1708592837-utils.py",
     "video_link": "https://youtube.com/...",
     "remark": "Pending"
   }
   ↓                             Query Processor
   ├─────────────────────────→ SQLite3
   │                            ↓
   │                     INSERT INTO knowledge (
   │                       employee, brand, link, ...
   │                     ) VALUES (?, ?, ?, ...)
   │                            ↓
   │                     ✓ Record inserted
   │                     ① New ID: 42
   │                            ↓
   ←─────────────────────────←─ Response:
                              { 
                                success: true, 
                                id: 42 
                              }
   ↓
7. Frontend receives success
   ↓
8. Re-fetch all records for John Smith
   ↓
   GET http://localhost:8000/knowledge/John%20Smith
   ├─────────────────────────→ SELECT * FROM knowledge
   │                           WHERE employee = 'John Smith'
   │                            ↓
   │                     2 rows found (includes new record)
   │                            ↓
   ←─────────────────────────←─ Response:
                              [
                                { id: 1, brand: "Sample", ... },
                                { id: 42, brand: "React", ... }
                              ]
   ↓
9. Table re-renders with new row
   ↓
✓ User sees new row in table!
```

---

## 🔐 Security Flow

```
User Credentials
    ↓
Browser (plain text in input field)
    ↓
HTTPS transmission (encrypted)
    ↓
Backend receives: POST /auth/login
    ↓
Database query: SELECT * FROM users 
                WHERE login_id = ? AND password = ?
    ↓
Match found?
    ├─ YES: Return { success: true }
    └─ NO: Return { success: false }
    ↓
Frontend: Set state isLoggedIn = true/false
    ↓
Redirect to Dashboard/Stay on Login
```

---

## 📈 Performance Optimization

```
Initial Load
├─ Browser loads React app (Vite bundled)
├─ Component tree initialized
├─ Dashboard selected employee is "John Smith"
└─ API call: GET /knowledge/John Smith
   ├─ Database query executed
   └─ Response cached in React state

Tab Switch
├─ User clicks "Sarah Johnson" tab
├─ API call: GET /knowledge/Sarah Johnson
├─ Fetch only necessary data
└─ Table re-renders with new employee's data

Row Operations
├─ Add: POST request + read data
├─ Edit: PUT request with updated row
├─ Delete: DELETE request + confirmation
└─ All operations: Immediate UI update + sync

File Upload
├─ File selected
├─ Multer processes in real-time
├─ User can save without waiting
└─ File path stored with other data
```

---

This architecture ensures:
✅ Clean separation of concerns
✅ Scalable data management
✅ Real-time synchronization
✅ Efficient file handling
✅ Secure authentication
✅ Responsive user experience
