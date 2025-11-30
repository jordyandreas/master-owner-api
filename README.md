# Master Owner API

A simple, structured Express.js backend created for a mobile assessment test.  
This API provides a list of owners, their cats, supports sorting, selecting a master owner, and includes full unit tests.

This project is designed with:

- Clear API structure
- Persistent data using a JSON file (file-backed DB)
- Testability (Jest + Supertest)
- Scalability considerations
- Clean modular folders

---

## 🚀 Tech Stack

- Node.js 20
- Express.js
- JSON file-based persistence (using fs)
- Jest + Supertest
- CORS + body-parser
- UUID via crypto.randomUUID()

---

## 📁 Project Structure

```
master-owner-api/
│
├── src/
│   ├── app.js
│   ├── server.js
│   ├── routes/
│   │   └── owners.js
│   ├── db/
│   │   └── db.js
│   └── middleware/
│       └── errorHandler.js
│
├── src/__tests__/
│   └── owners.test.js
│
├── package.json
└── README.md
```

---

## 📦 Installation

Clone the repository:

```bash
git clone git@github.com:YOUR_USERNAME/master-owner-api.git
cd master-owner-api
```

Install dependencies:

```bash
npm install
```

---

## 🏃 Running the Server

Start in development mode:

```bash
npm run dev
```

The API runs at:

```
http://localhost:4000
```

---

## 🧪 Running Tests

```bash
npm test
```

The test suite covers:

- GET /owners
- GET /owners?sort=cats
- PATCH /owners/:id/master
- Validation errors

---

## 🐱 API Endpoints

### **GET /owners**

Returns all owners, sorted optionally by:

- `name`
- `cats` (number of cats)

Supports:

```
limit=
offset=
sort=name|cats
```

Example:

```
GET http://localhost:4000/owners?sort=cats
```

---

### **GET /owners/:id**

Returns a single owner with their cats.

Example:

```
GET http://localhost:4000/owners/<id>
```

---

### **PATCH /owners/:id/master**

Sets or unsets the master owner.

#### Set master:

Request:

```json
{ "master": true }
```

Response:

```json
{ "masterOwnerId": "<id>" }
```

#### Unset master:

```json
{ "master": false }
```

---

## 🧱 Data Persistence

Data is stored in:

```
src/db/data.json
```

During tests, the database resets automatically for consistent results.

---

## ⚙️ Scalability Notes

To scale to tens of thousands of owners:

- Replace JSON file with Postgres / MongoDB
- Add database indexes
- Add cursor-based pagination
- Add caching (Redis) for heavy sorting

The architecture supports swapping the DB layer easily.

---

## 🎁 Optional Enhancements

- Shake-to-master feature (mobile)
- Add Swagger documentation
- Add Dockerfile
- Add more validation

---

## 👤 Author

Jordy Andreas  
GitHub: https://github.com/jordyandreas

---
