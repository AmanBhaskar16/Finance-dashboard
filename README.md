# 💰 Personal Finance Tracker

A full-stack Personal Finance Tracker Web Application built using React, Node.js, and PostgreSQL.  
It helps users track income and expenses, manage transactions, visualize spending, and get financial insights.

---

## 🚀 Features

### 🔐 Authentication
- User Registration & Login
- JWT Authentication
- Password hashing using bcrypt
- Protected routes
- Get logged-in user (/auth/me)

---

### 💸 Transactions
- Add income/expense transactions
- Edit transactions
- Delete transactions
- View all transactions
- User-specific data (ownership protection)

---

### 🔎 Filtering & Querying
- Pagination support
- Filter by category
- Filter by type (income / expense)
- Date range filtering
- Safe sorting

---

### 📊 Analytics
- Total income calculation
- Total expense calculation
- Net balance calculation
- Top spending category
- Rule-based financial insights

---

### 📈 Charts & Visualization
- Pie chart for category-wise spending
- Built using Recharts.js

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- TypeScript
- Tailwind CSS
- Recharts
- Zod (validation)
- Sonner (toast notifications)

### Backend
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication
- bcrypt.js

---
## 📡 API Endpoints

### Auth
- `POST /auth/register` → Register user  
- `POST /auth/login` → Login user  
- `GET /auth/me` → Get current user  

### Transactions
- `POST /api/transactions` → Create transaction  
- `GET /api/transactions` → Get all transactions  
- `GET /api/transactions/:id` → Get single transaction  
- `PUT /api/transactions/:id` → Update transaction  
- `DELETE /api/transactions/:id` → Delete transaction  

### Analytics
- `GET /api/transactions/summary` → Income, expense, net balance  
- `GET /api/transactions/chart` → Category-wise chart data  
- `GET /api/transactions/insight` → Financial insight  



## ⚙️ Installation & Setup

### 1. Clone Repo
```bash
git clone <your-repo-link>
cd project-name
```
### 2. Backend Setup
```bash
cd server
npm install
```
#### Create .env file:
```bash
DATABASE_URL=your_neondb_prisma_database_url
JWT_SECRET=your_secret_key
PORT = your_port_address
```

#### Run backend:
```bash
npx prisma migrate dev
npm run dev
```
### 3. Frontend Setup
```bash
cd client
npm install
```
#### Create .env file:
```bash
VITE_API_URL=your_backend_api_url
```
#### Run frontend:
```bash
npm run dev
```
---
### 📸 Screenshots
- Auth Page
  <img width="1572" height="828" alt="image" src="https://github.com/user-attachments/assets/9dc9d5fd-20bb-4e17-9cec-998825ff43b3" />
  <img width="1538" height="750" alt="image" src="https://github.com/user-attachments/assets/d3ff4faf-1b52-4457-8e5e-b2f3ff26aea3" />

- Dashboard & charts
  <img width="1726" height="856" alt="image" src="https://github.com/user-attachments/assets/8f4d2c45-c0f7-416b-97c4-219a1272e09a" />

- Transactions Page
<img width="1288" height="736" alt="image" src="https://github.com/user-attachments/assets/452ec577-6cb8-406c-b98f-da5ed370d302" />

---

### 🎯 Key Highlights
- Full-stack CRUD application
- JWT authentication
- Advanced filtering & pagination
- Data visualization using charts
- Clean backend architecture with Prisma
- Form validation using Zod
- Toast notifications using Sonner
  
---
### 👨‍💻 Author

Aman Bhaskar
