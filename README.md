# 🕌 Madrasa Payment Tracker - Server (Backend)

An enterprise-grade, role-based backend server built for Madrasa student fee management, multi-channel payment tracking, teacher salary administration, categorized expense tracking, audit logging, and financial reporting with PDF generation.

---

## 🛠️ Technology Stack

- **Runtime & Language**: Node.js with TypeScript (Strict Mode)
- **Framework**: Express.js
- **Database & ODM**: MongoDB with Mongoose
- **Authentication**: JWT (Access & Refresh Tokens) + bcryptjs Password Hashing
- **Authorization**: Role-Based Access Control (`ADMIN`, `GUARDIAN`, `TEACHER`)
- **Validation**: Zod Schema Validation Middleware
- **PDF Generation**: PDFKit (Receipts, Financial Statements, Dues & Salary Reports)
- **File Uploads**: Multer (Payment proofs, bank deposit slips, expense vouchers)
- **Security & Utilities**: Helmet, CORS, Express Rate Limit, Morgan, Custom Audit Logger

---

## 📁 Project Architecture & Folder Structure

```
src/
├── app.ts                         # Express application setup & middleware registration
├── index.ts                       # Server bootstrap & MongoDB connection
├── config/
│   ├── database.ts                # MongoDB Mongoose connection
│   ├── env.ts                     # Validated environment configuration
│   └── multer.ts                  # Controlled file upload configuration
├── constants/
│   ├── enums.ts                   # User roles, payment methods/statuses, expense categories
│   └── index.ts
├── middlewares/
│   ├── auth.middleware.ts         # JWT authentication & role-based authorization
│   ├── error.middleware.ts        # Global error handler (Zod, Mongoose, JWT errors)
│   ├── validate.middleware.ts     # Zod schema validation middleware
│   └── rateLimiter.middleware.ts  # Rate limiting for auth & sensitive endpoints
├── utils/
│   ├── apiResponse.ts             # Standardized JSON response envelope
│   ├── apiError.ts                # Custom ApiError class with HTTP status codes
│   ├── catchAsync.ts              # Async handler wrapper eliminating try-catch boilerplate
│   ├── jwt.ts                     # JWT sign & verify utility
│   ├── pdfGenerator.ts            # PDFKit templates for Receipts & Statements
│   └── seeder.ts                  # Automated database seeder
└── modules/
    ├── auth/                      # Login, Refresh Token, Change Password, Profile
    ├── user/                      # Admin user management & role assignment
    ├── guardian/                  # Guardian profiles & linked students
    ├── student/                   # Student profiles, admission IDs, semester assignments
    ├── teacher/                   # Teacher profiles & assigned subjects
    ├── semester/                  # Academic semesters & active period management
    ├── fee/                       # Fee configurations & student-specific overrides
    ├── payment/                   # bKash/Nagad/Bank/Offline payment submission & verification
    ├── salary/                    # Teacher monthly salary disbursement & history
    ├── expense/                   # Categorized expense tracking & vouchers
    ├── result/                    # Student exam marks & automatic grade calculation
    ├── dashboard/                 # Analytics & summaries for Admin, Guardian, and Teacher
    ├── report/                    # PDF report generators (Monthly, Pending, Statements)
    ├── notification/              # In-app notifications
    ├── audit/                     # Administrative action audit logging
    └── setting/                   # Madrasa configuration, payment numbers & bank info
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally or a MongoDB Atlas URI

### 2. Installation
```bash
git clone https://github.com/Shakwath/Payment-tracker-server.git
cd Payment-tracker-server
npm install
```

### 3. Environment Variables Setup
Create a `.env` file in the root directory (based on `.env.example`):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/madrasa_payment_tracker
CORS_ORIGIN=*
JWT_ACCESS_SECRET=madrasa_jwt_access_secret_key_2026
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_SECRET=madrasa_jwt_refresh_secret_key_2026
JWT_REFRESH_EXPIRES_IN=30d
UPLOAD_DIR=uploads
```

### 4. Seed Initial Data & Demo Accounts
Run the automated seeder to initialize default settings, admin, teacher, guardian, student, and sample records:
```bash
npm run seed
```

### 5. Start Development Server
```bash
npm run dev
```

### 6. Build for Production
```bash
npm run build
npm run start
```

---

## 🔑 Default Seed Credentials

| Role | Email / Phone | Password | Portal / Permissions |
|---|---|---|---|
| **Admin** | `admin@madrasah.com` | `admin123456` | Full administrative, financial & configuration access |
| **Teacher** | `teacher@madrasah.com` | `teacher123456` | Profile, subjects, salary history, student result entry |
| **Guardian** | `guardian@madrasah.com` | `guardian123456` | Linked students, fee payments, receipts, results |

---

## 📚 API Endpoints Directory

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Login with email/phone + password |
| `POST` | `/api/auth/refresh-token` | Public | Get new access token |
| `POST` | `/api/auth/change-password` | Authenticated | Change current password |
| `GET` | `/api/auth/me` | Authenticated | Get current authenticated user profile |

### 👥 User Management (`/api/users`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/users` | Admin | List all user accounts with filters & pagination |
| `POST` | `/api/users` | Admin | Create a new user |
| `GET` | `/api/users/:id` | Admin | Get user details |
| `PATCH` | `/api/users/:id` | Admin | Update user role/status/avatar |
| `POST` | `/api/users/:id/reset-password` | Admin | Reset user password |

### 🎓 Students (`/api/students`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/students` | Authenticated | List students (search, filter by semester/class/guardian) |
| `POST` | `/api/students` | Admin | Add student (auto-generates Admission ID) |
| `GET` | `/api/students/:id` | Authenticated | Get student profile with linked guardian and semester |
| `PATCH` | `/api/students/:id` | Admin | Update student information |

### 👨‍👦 Guardians (`/api/guardians`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/guardians/me` | Guardian | Get logged-in guardian's profile & linked students |
| `GET` | `/api/guardians` | Admin | List all guardians |
| `POST` | `/api/guardians` | Admin | Add guardian (optional user account creation) |
| `GET` | `/api/guardians/:id` | Admin / Guardian | Get guardian profile |
| `PATCH` | `/api/guardians/:id` | Admin | Update guardian profile |

### 📅 Semesters (`/api/semesters`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/semesters/current` | Authenticated | Get active current academic semester |
| `GET` | `/api/semesters` | Authenticated | List all semesters |
| `POST` | `/api/semesters` | Admin | Create new semester |
| `PATCH` | `/api/semesters/:id` | Admin | Update semester |

### 💵 Fee Configurations (`/api/fees`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/fees/student/:studentId/semester/:semesterId` | Authenticated | Resolve exact fee rule for a student in a semester |
| `GET` | `/api/fees` | Authenticated | List fee configurations |
| `POST` | `/api/fees` | Admin | Create fee rule or student override |
| `PATCH` | `/api/fees/:id` | Admin | Update fee configuration |
| `DELETE` | `/api/fees/:id` | Admin | Delete fee configuration |

### 💳 Payments (`/api/payments`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/payments/submit` | Admin / Guardian | Submit fee payment (bKash, Nagad, Bank, Offline) with proof |
| `PATCH` | `/api/payments/:id/verify` | Admin | Verify or reject payment with notes & audit logs |
| `GET` | `/api/payments/my-payments` | Guardian | Get payment history for logged-in guardian |
| `GET` | `/api/payments` | Admin | List payments with comprehensive filters |
| `GET` | `/api/payments/:id` | Authenticated | Get payment record details |

### 🧾 Expenses (`/api/expenses`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/expenses` | Admin | List expenses by month/category & total sum |
| `POST` | `/api/expenses` | Admin | Add categorized expense with attachment voucher |
| `GET` | `/api/expenses/:id` | Admin | Get expense details |
| `PATCH` | `/api/expenses/:id` | Admin | Update expense |
| `DELETE` | `/api/expenses/:id` | Admin | Delete expense |

### 👨‍🏫 Teachers & Salary (`/api/teachers`, `/api/teacher-salaries`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/teachers/me` | Teacher | Get teacher profile |
| `GET` | `/api/teachers` | Admin | List all teachers |
| `POST` | `/api/teachers` | Admin | Add teacher (auto teacher ID & user account) |
| `GET` | `/api/teacher-salaries/summary` | Admin | View teacher salary paid/due summary for a month |
| `POST` | `/api/teacher-salaries` | Admin | Pay monthly salary (prevents duplicates & auto records expense) |
| `GET` | `/api/teacher-salaries/my-salary` | Teacher | View personal salary payment history |

### 📊 Dashboards (`/api/dashboard`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/dashboard/admin` | Admin | Full financial KPIs, expected vs collected income, dues, net balance |
| `GET` | `/api/dashboard/guardian` | Guardian | Linked students status, payments, dues & exam results |
| `GET` | `/api/dashboard/teacher` | Teacher | Assigned subjects, salary status & notices |
| `GET` | `/api/dashboard/trends` | Admin | 12-month collection vs expense comparison trends |

### 📄 Reports & PDF Exports (`/api/reports`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/reports/receipt/:paymentId/pdf` | Authenticated | Download official printable PDF Money Receipt |
| `GET` | `/api/reports/financial-summary?format=pdf` | Admin | Download PDF Monthly Financial Statement |
| `GET` | `/api/reports/monthly-payments` | Admin | Monthly verified collection report |
| `GET` | `/api/reports/pending-payments` | Admin | Monthly pending student dues report |
| `GET` | `/api/reports/expenses` | Admin | Monthly categorized expense report |

### 📝 Academic Results (`/api/results`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/results/student/:studentId` | Authenticated | View exam results for a student |
| `POST` | `/api/results` | Admin / Teacher | Record student marks (auto calculates grade) |
| `PATCH` | `/api/results/:id` | Admin / Teacher | Update marks |

### 🔔 Notifications & 🛡️ Audit Logs (`/api/notifications`, `/api/audit-logs`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/notifications/my-notifications` | Authenticated | Get user notifications & unread count |
| `PATCH` | `/api/notifications/:id/read` | Authenticated | Mark notification as read |
| `PATCH` | `/api/notifications/mark-all-read` | Authenticated | Mark all notifications as read |
| `GET` | `/api/audit-logs` | Admin | View audit trail of financial & administrative actions |

### ⚙️ System Settings (`/api/settings`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/settings` | Public / Auth | View madrasa details, bKash/Nagad/Bank info & instructions |
| `PATCH` | `/api/settings` | Admin | Update madrasa configuration, logo, and payment numbers |

---

## 🛡️ Key Business & Security Rules

1. **Compound Uniqueness**: Verified payments are indexed uniquely per `(studentId, semesterId, month, year, feeType)` to prevent duplicate payments.
2. **Duplicate Salary Prevention**: Teachers cannot have duplicate paid salary records for the same month and year.
3. **Automatic Salary Expense Tracking**: When an admin records a paid teacher salary, an expense record under `SALARY` is automatically created with the salary receipt voucher.
4. **Historical Snapshot Integrity**: Every payment snapshots the student's expected fee at the time of payment, ensuring subsequent fee structure changes do not corrupt past ledger history.
5. **Role Security**: Least-privilege role protection via JWT middleware ensures Guardians and Teachers only access authorized records.
6. **Audit Trail**: Sensitive actions (payment status verification, settings changes, fee configurations, expense additions) are logged into the `AuditLog` collection.

---

## 👨‍💻 Developer & License
Developed for **Madrasa Payment Tracker**.
Repository: [Shakwath/Payment-tracker-server](https://github.com/Shakwath/Payment-tracker-server)
