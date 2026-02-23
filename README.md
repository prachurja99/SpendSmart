# SpendSmart — AI-Powered Expense Tracker

A full-stack expense tracking web application with AI-powered categorization, interactive charts, monthly filtering, and PDF report generation.

## Live Demo

[https://spend-smart-ten-alpha.vercel.app](https://spend-smart-ten-alpha.vercel.app)

## Screenshots


### Dashboard
![Dashboard](screenshots/dashboard.png)


## Features

- User authentication with JWT (Register & Login)
- Add, Edit, Delete expenses
- AI-powered expense categorization using Groq LLM
- Interactive pie and bar charts for spending breakdown
- Monthly spending trend chart (last 6 months)
- Month-by-month expense filtering
- Export expense report as PDF with embedded charts
- Persistent data storage with MongoDB Atlas

## Tech Stack

**Frontend:**
- React.js (Vite)
- Recharts
- React Router DOM
- Axios
- jsPDF + jsPDF-AutoTable

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Groq SDK (LLM API)

**Deployment:**
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB Atlas account
- Groq API key

### Clone the repository
```bash
git clone https://github.com/prachurja99/SpendSmart.git
cd SpendSmart
```

### Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
PORT=5000
CLIENT_URL=http://localhost:5173
GROQ_API_KEY=your_groq_api_key
```
```bash
npm run dev
```

### Setup Frontend
```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/`:
```
VITE_API_URL=http://localhost:5000/api
```
```bash
npm run dev
```

Open **http://localhost:5173** in your browser.

## Project Structure
```
SpendSmart/
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # Route logic
│   ├── middleware/      # Auth middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # Auth context
│   │   ├── pages/       # Page components
│   │   └── utils/       # API utility
│   └── index.html
└── README.md
```

## Author

**Prachurja Bhattacharjee**
Computer Science & Engineering Graduate — BRAC University
[GitHub](https://github.com/prachurja99) | [LinkedIn](https://www.linkedin.com/in/prachurja-bhattacharjee-94568b281/)
