# HR Leave Management System — Backend API

A complete Node.js + Express.js backend for an HR Leave Management dashboard.

---

## Tech Stack

| Layer        | Technology                  |
|--------------|-----------------------------|
| Runtime      | Node.js                     |
| Framework    | Express.js                  |
| Database     | MySQL (via `mysql2` pool)   |
| Auth         | JWT + bcryptjs              |
| Validation   | express-validator           |
| Date utils   | dayjs                       |
| PDF export   | pdfkit                      |
| Excel export | exceljs                     |

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your MySQL credentials and JWT secret
```

### 3. Create the database & seed data
```bash
npm run db:setup
```

### 4. Start the server
```bash
npm run dev   # development (nodemon)
npm start     # production
```

Server runs on `http://localhost:3000`

---

## Project Structure

```
src/
├── app.js                    ← Express entry point
├── config/
│   └── db.js                 ← MySQL connection pool
├── controllers/
│   ├── auth.controller.js
│   ├── leave.controller.js
│   └── holiday.controller.js
├── middleware/
│   ├── auth.middleware.js    ← JWT verify + role guard
│   ├── error.middleware.js   ← Centralised error handler
│   └── validate.middleware.js
├── routes/
│   ├── auth.routes.js
│   ├── leave.routes.js
│   └── holiday.routes.js
├── services/
│   ├── auth.service.js
│   ├── leave.service.js
│   ├── holiday.service.js
│   └── export.service.js     ← PDF + Excel generation
├── utils/
│   ├── date.utils.js
│   ├── jwt.utils.js
│   └── response.utils.js
└── database/
    ├── schema.sql            ← DDL + seed data
    └── setup.js              ← Run schema programmatically
```

---

## API Reference

### Authentication

| Method | Endpoint          | Auth     | Description          |
|--------|-------------------|----------|----------------------|
| POST   | /auth/register    | Public   | Register new user    |
| POST   | /auth/login       | Public   | Login, receive JWT   |
| GET    | /auth/profile     | Employee | Get own profile      |

### Leave

| Method | Endpoint                        | Auth     | Description                  |
|--------|---------------------------------|----------|------------------------------|
| GET    | /leave/balance                  | Employee | View leave balances          |
| POST   | /leave/apply                    | Employee | Submit leave application     |
| GET    | /leave/my-requests              | Employee | View own leave history       |
| GET    | /leave/all-requests             | Admin    | View all employee leaves     |
| PATCH  | /leave/update-status/:leaveId   | Admin    | Approve / Reject leave       |
| GET    | /leave/calendar                 | Employee | Calendar view of leaves      |
| GET    | /leave/summary/download         | Employee | Download PDF or Excel report |

### Holidays

| Method | Endpoint       | Auth     | Description       |
|--------|----------------|----------|-------------------|
| GET    | /holidays      | Employee | List all holidays |
| POST   | /holidays      | Admin    | Add a holiday     |
| DELETE | /holidays/:id  | Admin    | Delete a holiday  |

---

## Seed Credentials

| Role     | Email                | Password      |
|----------|----------------------|---------------|
| Admin    | admin@company.com    | Admin@123     |
| Employee | john@company.com     | Employee@123  |

> **Note:** The seed passwords in `schema.sql` are bcrypt hashes.  
> You should register fresh users via `POST /auth/register` and set real passwords.

---

## Error Response Format

```json
{
  "success": false,
  "message": "Descriptive error message here."
}
```

Validation errors include an `errors` array:

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    { "field": "startDate", "message": "Start date is required." }
  ]
}
```

---

## Leave Balance Rules

- **Annual Leave** — 18 days/year total
- **Sick Leave** — 8 days/year total  
- **Casual Leave** — 4 days/year total
- **LWOP** — No limit; tracked separately

Balance is deducted automatically when an Admin approves a request.

---

## Key Business Logic

- **Duration** is calculated as working days (Mon–Fri), excluding weekends
- **Overlap detection** prevents duplicate/conflicting leave applications
- **Balance validation** runs before inserting a leave record
- **Admin-only routes** are protected by the `authorizeAdmin` middleware
- All routes are protected by the `authenticate` JWT middleware

---

## Postman Collection

Import `HR_Leave_API.postman_collection.json` into Postman.

Steps:
1. Run **Login** — token is saved automatically as a collection variable
2. All protected requests use `{{token}}` automatically
