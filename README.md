# Problem-5 — CRUD API (TypeScript + Express + Prisma)

Simple CRUD backend with filtering, search, pagination, and sorting.  
Built using **Express + TypeScript + Prisma (SQLite)**.

---

## ⚙️ Setup

```bash
git clone https://github.com/99Tech-VN/problem-5.git
cd problem-5
npm install
npm run prisma:migrate
npm run dev
````

API runs at: `http://localhost:3000`

---

## 📡 API

### Create

**Linux/macOS**

```bash
curl -X POST http://localhost:3000/resources \
  -H "Content-Type: application/json" \
  -d '{"name":"Task 1","description":"Check server","tags":["demo","test"]}'
```

**Windows PowerShell**

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/resources" -Method POST -Headers @{ "Content-Type"="application/json" } -Body '{"name":"Task 1","description":"Check server","tags":["demo","test"]}'
```

### List

```bash
curl "http://localhost:3000/resources?q=task&tag=demo&limit=5&offset=0&sort=name&order=asc"
```

### Get One

```bash
curl "http://localhost:3000/resources/1"
```

### Update

```bash
curl -X PATCH http://localhost:3000/resources/1 \
  -H "Content-Type: application/json" \
  -d '{"description":"Updated"}'
```

### Delete

```bash
curl -X DELETE http://localhost:3000/resources/1
```

---

## 📂 .env

```
DATABASE_URL="file:./dev.db"
PORT=3000
```

---

✅ That’s it — install, migrate, run, and test with curl.

```
