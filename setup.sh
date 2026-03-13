#!/bin/bash
# This script initializes the database with sample data

echo "🗂️  Initializing Employee Knowledge System..."

echo "📦 Installing backend dependencies..."
cd backend
npm install
echo "✅ Backend dependencies installed"

echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install
echo "✅ Frontend dependencies installed"

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Terminal 1: cd backend && node server.js"
echo "2. Terminal 2: cd frontend && npm run dev"
echo "3. Open: http://localhost:5173"
echo "4. Login with: admin / admin123"
echo ""
