# 🚀 MediCore+ Complete Deployment Guide

This guide will walk you through deploying your application from start to finish. Because you have already pushed your code to GitHub, we can skip straight to deploying the Backend to **Render** and the Frontend to **Vercel**.

---

## 🏗️ Phase 1: Deploy the Backend & Database (Render)

Render will host both your PostgreSQL database and your Node.js/Express API.

### 1. Set Up the Database
> **Note:** If you already created a database on Render or Neon.tech, you can skip to step 2 and just use that `DATABASE_URL`.

1. Go to the [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** in the top right and select **PostgreSQL**.
3. Name your database (e.g., `medicore-db`), scroll down, select the **Free tier**, and click **Create Database**.
4. Wait about 30 seconds for it to provision. Once it's ready, scroll down to the "Connections" section and copy the **Internal Database URL** (it looks like `postgresql://user:pass@host/db`).

### 2. Deploy the Node.js API
1. Click **New +** again and select **Web Service**.
2. Select your `healthcare-app` repository from GitHub.
3. Configure the service exactly like this:
   - **Name:** `medicore-backend`
   - **Root Directory:** `backend` *(CRITICAL: Must be lowercase 'backend' so it ignores the frontend)*
   - **Environment:** `Node`
   - **Build Command:** `npm install && npx prisma generate`
   - **Start Command:** `npm start`
4. Scroll down to **Advanced > Environment Variables** and add three variables:
   - `DATABASE_URL`: *(Paste the Database URL from Step 1)*
   - `JWT_SECRET`: `super_secret_production_key_99`
   - `PORT`: `5000`
5. Select the **Free tier** and click **Create Web Service**.
6. Wait for the build logs to finish. When it says `Your service is live 🎉`, **copy your live backend URL** (found at the top left, e.g., `https://medicore-backend.onrender.com`).

### 3. Seed the Live Database
We need to run the Prisma commands to create the tables in your new cloud database and populate the dummy users.
1. While still on your `medicore-backend` page in Render, click the **Shell** tab on the left menu.
2. Run this command to create the database tables:
   ```bash
   npx prisma db push
   ```
3. Run this command to add the Admin, Doctor, and Patient accounts:
   ```bash
   npm run db:seed
   ```

---

## 🌐 Phase 2: Deploy the Frontend (Vercel)

Vercel will host your Vite/React user interface.

1. Go to the [Vercel Dashboard](https://vercel.com/) and click **Add New Project**.
2. Import your `healthcare-app` repository.
3. Configure the project exactly like this:
   - **Framework Preset:** `Vite` (Vercel usually auto-detects this)
   - **Root Directory:** Click "Edit" and select `frontend`.
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Expand the **Environment Variables** section and add:
   - **Name:** `VITE_API_URL`
   - **Value:** *(Paste the live Render URL you copied in Phase 1, e.g., `https://medicore-backend.onrender.com`)*
5. Click **Deploy**.

---

## 🎉 You're Finished!

Once Vercel finishes building, it will give you a live preview link (e.g., `https://healthcare-app.vercel.app`). Click it to view your live, fully deployed application!

### Default Login Credentials
Use these accounts to test the live system:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@medicore.com` | `password123` |
| **Doctor** | `doctor@medicore.com` | `password123` |
| **Patient** | `patient@medicore.com` | `password123` |

> **Continuous Deployment is active!** Anytime you make changes to your local code and run `git push origin main`, both Render and Vercel will automatically rebuild and deploy your updates.
