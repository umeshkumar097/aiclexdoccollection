# 🚀 AICLEX - Enterprise Document Collection & Verification Portal
**Comprehensive Installation & Setup Guide**

Thank you for purchasing the AICLEX Portal! We have built a state-of-the-art visual installation wizard to make setting up your portal incredibly easy. 

Please read this documentation carefully to understand all the steps. Nothing is missing—just follow along!

---

## 🛠️ 1. Prerequisites

Before installing the script, you will need accounts on a few free platforms to host your database and storage:
1. **Node.js**: Version 18.x or 20.x installed on your server/computer.
2. **PostgreSQL Database**: We recommend [Neon.tech](https://neon.tech) or [Supabase](https://supabase.com).
3. **Cloudflare R2**: For ultra-fast, cheap document storage (AWS S3 can also be used).
4. **Envato Purchase Code**: Found in your CodeCanyon Downloads section.

---

## 🔑 2. Gathering Your Credentials (Do this first)

### A. Get Your Envato Purchase Code
1. Log in to your CodeCanyon account.
2. Hover over your username and click on **Downloads**.
3. Click **Download** next to AICLEX Portal and select **License certificate & purchase code (text)**.
4. Copy the "Item Purchase Code".

### B. Create a PostgreSQL Database
1. Go to [Neon.tech](https://neon.tech) and create a free account.
2. Create a new project.
3. On the dashboard, copy the **Connection String** (Database URL).
   *Format should look like:* `postgresql://username:password@host.aws.neon.tech/dbname?sslmode=require`

### C. Create Cloudflare R2 Storage
1. Go to your Cloudflare Dashboard -> **R2 Object Storage**.
2. Create a new bucket (e.g., `aiclex-docs`).
3. Click on **Manage R2 API Tokens** -> Create a new token with "Object Read & Write" permissions.
4. Copy your **Access Key ID** and **Secret Access Key**.
5. Note down your **Endpoint URL** (e.g., `https://<account-id>.r2.cloudflarestorage.com`) and connect a Custom Domain or Public R2 URL (e.g., `https://pub-xxxx.r2.dev`).

---

## 💻 3. Starting the Application

Once you have gathered your credentials, follow these steps to launch the Automated Setup Wizard.

1. **Extract the ZIP file** you downloaded from CodeCanyon.
2. Open your terminal (or Command Prompt) and navigate to the extracted folder.
3. Install the required dependencies by running:
   ```bash
   npm install
   ```
4. Build the application:
   ```bash
   npm run build
   ```
5. Start the server:
   ```bash
   npm start
   ```
*(For local development, you can use `npm run dev`)*

---

## 🧙‍♂️ 4. The Automated Installation Wizard

Once your server is running, open your web browser and go to:
👉 **`http://localhost:3000`**

Since this is your first time running the app, you will automatically be redirected to the **AICLEX Installer Wizard**. 

Follow the 4 simple steps on the screen:

### Step 1: License Verification
Paste your Envato Purchase Code. The system will securely connect to the licensing server to verify your purchase. 

### Step 2: Database Configuration
Paste your PostgreSQL Database URL (from Neon/Supabase). 
Click **"Connect & Create Tables"**. The system will automatically connect to your database and generate all the necessary tables. You don't need to run any manual commands!

### Step 3: Storage Configuration
Enter your Cloudflare R2 Access Key, Secret Key, Endpoint, Bucket Name, and Public URL.
Click **"Test Storage"**. The system will ping Cloudflare to ensure your keys are valid.

### Step 4: Admin Account & Finalize
Enter an email and password that you want to use for the Admin Dashboard.
Click **"Install & Finish"**.

*🎉 The system will save all your configurations securely, create your admin account, and redirect you to the Login screen!*

---

## 🌐 5. Production Deployment (Vercel)

The easiest way to host this Next.js application live on the internet is using Vercel.

1. Create a private repository on GitHub and upload your code there.
2. Go to [Vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. **Important:** Because Vercel does not allow writing files during runtime, you should manually add your configuration in Vercel's **Environment Variables** tab before clicking Deploy.
5. Add the following keys to Vercel:
   - `DATABASE_URL` (Your PostgreSQL string)
   - `AUTH_SECRET` (A random 32 character string)
   - `AUTH_URL` (Your live domain, e.g., `https://yourdomain.com`)
   - `R2_ACCESS_KEY_ID`
   - `R2_SECRET_ACCESS_KEY`
   - `R2_ENDPOINT`
   - `R2_BUCKET_NAME`
   - `R2_PUBLIC_URL`
   - `AICLEX_UNLOCK_KEY` (You will get this after running it locally once)

Click **Deploy**, and your app will be live!

---

## 📞 6. Need Support?
If you face any issues during the installation, we are here to help!
Please open a support ticket on our CodeCanyon item page, and our technical team will assist you within 24 hours.

Enjoy your new Enterprise Document Collection Portal!
