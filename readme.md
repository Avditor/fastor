# 📇 CRM REST API — Node.js + Express + MongoDB (No Mongoose) + TypeScript

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

```ts
const MONGO_URI = "mongodb://127.0.0.1:27017";
```

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

---

## 📌 API Endpoints (with cURL)

### 🟩 1️⃣ Register Employee

**POST** `/api/register` — Public

```bash
curl -X POST http://localhost:5000/api/register \
-H "Content-Type: application/json" \
-d '{
  "name": "Avni Kanishk",
  "email": "avni@example.com",
  "password": "securePassword123"
}'
```

✅ **Response**

```json
{
  "message": "Employee registered successfully"
}
```

---

### 🟩 2️⃣ Employee Login

**POST** `/api/login` — Public

```bash
curl -X POST http://localhost:5000/api/login \
-H "Content-Type: application/json" \
-d '{
  "email": "avni@example.com",
  "password": "securePassword123"
}'
```

✅ **Response**

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5..."
}
```

> ⚠️ Copy the `token` for subsequent authorized requests.

---

### 🟩 3️⃣ Submit Public Enquiry

**POST** `/api/enquiry` — Public

```bash
curl -X POST http://localhost:5000/api/enquiry \
-H "Content-Type: application/json" \
-d '{
  "name": "Riya Sharma",
  "email": "riya@student.com",
  "courseInterest": "Data Science"
}'
```

✅ **Response**

```json
{
  "message": "Enquiry submitted successfully"
}
```

---

### 🟩 4️⃣ Fetch Public (Unclaimed) Enquiries

**GET** `/api/enquiries/public` — Requires JWT

```bash
curl -X GET http://localhost:5000/api/enquiries/public \
-H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

✅ **Response**

```json
{
  "enquiries": [
    {
      "_id": "67273bf0e3c3d0c58b2c3141",
      "name": "Riya Sharma",
      "email": "riya@student.com",
      "courseInterest": "Data Science",
      "claimedBy": null,
      "createdAt": "2025-11-03T10:02:00.234Z"
    }
  ]
}
```

---

### 🟩 5️⃣ Claim a Lead

**POST** `/api/enquiries/claim/:id` — Requires JWT

```bash
curl -X POST http://localhost:5000/api/enquiries/claim/67273bf0e3c3d0c58b2c3141 \
-H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

✅ **Response**

```json
{
  "message": "Enquiry claimed successfully"
}
```

---

### 🟩 6️⃣ Fetch My Claimed Leads

**GET** `/api/enquiries/my` — Requires JWT

```bash
curl -X GET http://localhost:5000/api/enquiries/my \
-H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

✅ **Response**

```json
{
  "enquiries": [
    {
      "_id": "67273bf0e3c3d0c58b2c3141",
      "name": "Riya Sharma",
      "email": "riya@student.com",
      "courseInterest": "Data Science",
      "claimedBy": "avni@example.com",
      "createdAt": "2025-11-03T10:02:00.234Z"
    }
  ]
}
```

---

### 🟩 7️⃣ Root Route (Sanity Check)

**GET** `/` — Public

```bash
curl http://localhost:5000/
```

✅ **Response**

```
CRM REST API is running ✅
```

---

## 🧠 Notes

* Replace `<YOUR_JWT_TOKEN>` with the actual token from `/api/login`.
* Replace `67273bf0e3c3d0c58b2c3141` with your own enquiry `_id` when claiming.
* All responses are in JSON.
* Built for easy integration with any frontend or mobile CRM dashboard.




