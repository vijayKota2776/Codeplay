# Deployment Guide for CodePlay

This guide will help you deploy the CodePlay application (MERN Stack).

## Prerequisites

- **GitHub Account**: To host your code.
- **MongoDB Atlas Account**: For the database.
- **Vercel Account**: For hosting the Frontend.
- **Render Account**: For hosting the Backend.

---

## 1. Database Setup (MongoDB Atlas)

1.  Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Create a new Cluster (Shared Free Tier is fine).
3.  Create a Database User (username/password) in "Database Access".
4.  Allow IP Access (0.0.0.0/0) in "Network Access".
5.  Get your Connection String:
    *   Click "Connect" -> "Drivers".
    *   Copy string (e.g., `mongodb+srv://<user>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority`).
    *   **Keep this safe!**

---

## 2. Backend Deployment (Render)

We will use Render for the Node.js backend.

1.  **Push your code to GitHub**. Ensure your `backend` folder is in the repo.
2.  Log in to [Render](https://render.com).
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub repository.
5.  **Configuration**:
    *   **Root Directory**: `backend`
    *   **Build Command**: `npm install`
    *   **Start Command**: `node server.js`
    *   **Environment Variables** (Add these):
        *   `NODE_ENV`: `production`
        *   `MONGO_URI`: *(Paste your MongoDB connection string here)*
        *   `JWT_SECRET`: *(Enter a long random string)*
        *   `PORT`: `10000` (Render default)
6.  Click **Deploy Web Service**.
7.  Once deployed, copy the **URL** (e.g., `https://codeplay-backend.onrender.com`).

---

## 3. Frontend Deployment (Vercel)

We will use Vercel for the React frontend.

1.  Log in to [Vercel](https://vercel.com).
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  **Configuration**:
    *   **Root Directory**: Click "Edit" and select `frontend`.
    *   **Framework Preset**: Create React App.
    *   **Environment Variables**:
        *   `REACT_APP_API_URL`: *(Paste your Backend URL from Step 2)* **IMPORTANT: Do not add a trailing slash**.
            *   Example: `https://codeplay-backend.onrender.com/api`
            *   *Note: Ensure your backend URL ends with /api if your frontend expects it.*
5.  Click **Deploy**.

---

## 4. Verification

1.  Open your Vercel URL.
2.  Register a new account.
3.  Check if you can access the Dashboard and Courses.

**Note on Labs/Docker**: The "Lab" feature requiring Docker containers will **not** work on standard Render hosting. The application has been updated to handle this gracefully (simulated mode or error message).
