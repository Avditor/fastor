# 📇 CRM REST API — Node.js + Express + MongoDB + TypeScript

A simple and secure **CRM REST API** built using **Node.js**, **Express**, **TypeScript**, and the **native MongoDB driver** (no Mongoose).  
It manages employee accounts and client enquiries with JWT-based authentication.

---

## 🚀 Features
✅ Employee Register/Login with JWT  
✅ Public Enquiry Submission (No Auth Required)  
✅ Claim Enquiry (Private to Counselor)  
✅ Fetch Public (Unclaimed) Enquiries  
✅ Fetch Claimed Enquiries by Logged-In User  

---

## ⚙️ Tech Stack
- **Backend:** Node.js, Express, TypeScript  
- **Database:** MongoDB (native driver)  
- **Authentication:** JSON Web Tokens (JWT)  
- **Hashing:** bcryptjs  

---

## 🧩 Project Setup

### 1️⃣ Clone & Install
```bash
git clone https://github.com/your-username/crm-rest-api.git
cd crm-rest-api
npm install
````

### 2️⃣ Run MongoDB

Make sure MongoDB is running locally or update the connection URI in `server.ts`:

### 3️⃣ Start the Server

```bash
npx ts-node server.ts
```

Server will start on `http://localhost:5000`

---

## 🔑 Base URL

```
http://localhost:5000
```

## 🧠 Notes

* Replace `<YOUR_JWT_TOKEN>` with the actual token from `/api/login`.
* Replace `67273bf0e3c3d0c58b2c3141` with your own enquiry `_id` when claiming.
* All responses are in JSON.
* Built for easy integration with any frontend or mobile CRM dashboard.




