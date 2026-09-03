# 📡 Madrasa Payment Tracker - Frontend API Documentation

Complete REST API specification and integration guide for the Frontend Developer.

---

## 🌐 Base URL & Configuration

- **Development Base URL**: `http://localhost:5000/api`
- **Static Uploads (Images/Files)**: `http://localhost:5000/uploads/{filename}`

---

## 🔒 Authentication & Headers

### Headers for Public Endpoints (e.g. Login, Refresh Token):
```json
{
  "Content-Type": "application/json"
}
```

### Headers for Protected Endpoints:
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <YOUR_ACCESS_TOKEN>"
}
```

### Headers for File Upload Endpoints (Multipart/Form-data):
```
Authorization: Bearer <YOUR_ACCESS_TOKEN>
Content-Type: multipart/form-data
```

---

## 📦 Standard Response Envelope Format

### 1. Success Response
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  },
  "data": { ... }
}
```

### 2. Error Response
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation Error",
  "errors": [
    {
      "field": "body.identifier",
      "message": "Email or Phone is required"
    }
  ]
}
```

---

## 🏷️ System Enums & Types (TypeScript Ready)

```typescript
// Roles
export type UserRole = 'ADMIN' | 'GUARDIAN' | 'TEACHER';

// Statuses
export type UserStatus = 'ACTIVE' | 'INACTIVE';
export type StudentStatus = 'ACTIVE' | 'INACTIVE' | 'GRADUATED';

// Payments
export type PaymentMethod = 'BKASH' | 'NAGAD' | 'BANK' | 'OFFLINE';
export type PaymentStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'CANCELLED' | 'REFUNDED';
export type FeeType = 'MONTHLY' | 'ADMISSION' | 'EXAM' | 'SESSION' | 'OTHER';

// Expenses
export type ExpenseCategory =
  | 'UTILITIES'
  | 'FOOD'
  | 'MAINTENANCE'
  | 'SUPPLIES'
  | 'TRANSPORT'
  | 'SALARY'
  | 'RENT'
  | 'OTHER';

// Teacher Salary
export type SalaryPaymentMethod = 'CASH' | 'BANK' | 'BKASH' | 'NAGAD';
export type SalaryPaymentStatus = 'PAID' | 'PENDING';

// Exam Results
export type ExamType = 'MONTHLY_TEST' | 'MIDTERM' | 'FINAL';

// Notifications
export type NotificationType =
  | 'PAYMENT_VERIFIED'
  | 'PAYMENT_REJECTED'
  | 'SALARY_PAID'
  | 'NOTICE'
  | 'RESULT_PUBLISHED'
  | 'GENERAL';
```

---

## 🔑 Test Accounts for Frontend Testing

| Role | Email / Identifier | Password | Access Portal |
|---|---|---|---|
| **Admin** | `admin@madrasah.com` | `admin123456` | Full Admin Dashboard & Settings |
| **Teacher** | `teacher@madrasah.com` | `teacher123456` | Teacher Portal, Salary & Student Results |
| **Guardian** | `guardian@madrasah.com` | `guardian123456` | Guardian Portal, Student Fees & Receipts |

---

## 1. 🔐 Authentication (`/api/auth`)

### 1.1 Login
- **URL**: `POST /api/auth/login`
- **Access**: Public
- **Request Body**:
```json
{
  "identifier": "admin@madrasah.com", // can be email OR phone
  "password": "admin123456"
}
```
- **Response `(200 OK)`**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "User logged in successfully",
  "data": {
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "eyJhbGciOi...",
    "user": {
      "_id": "66d6...",
      "name": "Super Admin",
      "email": "admin@madrasah.com",
      "phone": "01700000000",
      "role": "ADMIN",
      "status": "ACTIVE",
      "guardianId": null,
      "teacherId": null
    }
  }
}
```

### 1.2 Refresh Access Token
- **URL**: `POST /api/auth/refresh-token`
- **Access**: Public
- **Request Body**:
```json
{
  "refreshToken": "eyJhbGciOi..."
}
```
- **Response `(200 OK)`**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Access token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOi..."
  }
}
```

### 1.3 Get Current User Profile (Me)
- **URL**: `GET /api/auth/me`
- **Access**: Authenticated (`ADMIN`, `GUARDIAN`, `TEACHER`)
- **Headers**: `Authorization: Bearer <token>`
- **Response `(200 OK)`**: Returns logged-in user with populated `guardianId` or `teacherId`.

### 1.4 Change Password
- **URL**: `POST /api/auth/change-password`
- **Access**: Authenticated
- **Request Body**:
```json
{
  "oldPassword": "admin123456",
  "newPassword": "newSecretPassword123"
}
```

---

## 2. 📊 Dashboards (`/api/dashboard`)

### 2.1 Admin Dashboard Summary
- **URL**: `GET /api/dashboard/admin`
- **Access**: `ADMIN`
- **Query Params**: `month` (e.g. `September`), `year` (e.g. `2026`), `semesterId` (optional)
- **Response `(200 OK)`**:
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "period": { "month": "September", "year": 2026, "semester": { "id": "...", "name": "Year 2026 - Term 1" } },
    "students": { "totalActiveStudents": 150, "totalPaidStudents": 110, "totalPendingStudents": 40 },
    "financials": {
      "totalExpectedCollection": 375000,
      "totalVerifiedCollection": 275000,
      "totalPendingAmount": 100000,
      "totalMonthlyExpenses": 65000,
      "netBalance": 210000
    },
    "paymentMethods": { "BKASH": 150000, "NAGAD": 50000, "BANK": 40000, "OFFLINE": 35000 },
    "teachers": { "totalActiveTeachers": 8, "totalExpectedSalary": 200000, "totalPaidSalary": 150000, "totalDueSalary": 50000 },
    "pendingVerificationQueue": { "count": 5, "items": [ ... ] },
    "recentPayments": [ ... ],
    "recentExpenses": [ ... ]
  }
}
```

### 2.2 Guardian Dashboard Summary
- **URL**: `GET /api/dashboard/guardian`
- **Access**: `GUARDIAN`
- **Response `(200 OK)`**:
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "guardian": { "id": "...", "name": "Mohammad Rahim Uddin", "phone": "01713000001" },
    "currentMonth": "September",
    "currentYear": 2026,
    "students": [
      {
        "studentId": "...",
        "admissionId": "STU-2026-0001",
        "name": "Ahmed Hasan",
        "classProgram": "Hifz Section A",
        "rollNumber": "101",
        "monthlyFee": 2500,
        "currentMonthStatus": "PAID", // 'PAID' | 'PENDING_VERIFICATION' | 'UNPAID'
        "paymentDetails": { "receiptNo": "REC-202609-0001", "amount": 2500, "status": "VERIFIED" },
        "recentResults": [ ... ]
      }
    ],
    "recentPayments": [ ... ],
    "unreadNotificationsCount": 2
  }
}
```

### 2.3 Teacher Dashboard Summary
- **URL**: `GET /api/dashboard/teacher`
- **Access**: `TEACHER`
- **Response `(200 OK)`**: Returns assigned subjects, current month salary status (`isPaid: true/false`), salary payment history, and unread notification count.

### 2.4 12-Month Financial Trends
- **URL**: `GET /api/dashboard/trends?year=2026`
- **Access**: `ADMIN`
- **Response `(200 OK)`**: Array of all 12 months with `{ month, year, collection, expense, net }` (Ideal for Recharts line/bar chart).

---

## 3. 🎓 Students Management (`/api/students`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/students` | Authenticated | Query params: `search`, `semesterId`, `classProgram`, `status`, `guardianId`, `page`, `limit` |
| `POST` | `/api/students` | `ADMIN` | Create student |
| `GET` | `/api/students/:id` | Authenticated | Get student profile |
| `PATCH` | `/api/students/:id` | `ADMIN` | Update student profile |

### Create Student Body Example:
```json
{
  "name": "Ahmed Hasan",
  "arabicName": "أحمد حسن",
  "classProgram": "Hifz Section A",
  "rollNumber": "101",
  "gender": "MALE",
  "dateOfBirth": "2014-05-15",
  "admissionDate": "2025-01-10",
  "currentSemester": "66d6abc...",
  "guardianId": "66d6def...",
  "monthlyFee": 2500,
  "status": "ACTIVE",
  "bloodGroup": "B+",
  "address": "Mirpur, Dhaka"
}
```

---

## 4. 👨‍👦 Guardians Management (`/api/guardians`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/guardians/me` | `GUARDIAN` | Get current logged-in guardian profile & linked students |
| `GET` | `/api/guardians` | `ADMIN` | Query params: `search`, `status`, `page`, `limit` |
| `POST` | `/api/guardians` | `ADMIN` | Create guardian (pass `createAccount: true, password: "..."` to auto create login account) |
| `GET` | `/api/guardians/:id` | `ADMIN`, `GUARDIAN` | Get guardian profile |
| `PATCH` | `/api/guardians/:id` | `ADMIN` | Update guardian |

### Create Guardian Body Example:
```json
{
  "name": "Mohammad Rahim Uddin",
  "phone": "01713000001",
  "email": "guardian@madrasah.com",
  "address": "Mirpur, Dhaka",
  "occupation": "Businessman",
  "relation": "Father",
  "nid": "19852691234567",
  "createAccount": true,
  "password": "guardian123456"
}
```

---

## 5. 📅 Semesters Management (`/api/semesters`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/semesters/current` | Authenticated | Get current active semester |
| `GET` | `/api/semesters` | Authenticated | List all semesters |
| `POST` | `/api/semesters` | `ADMIN` | Create semester |
| `PATCH` | `/api/semesters/:id` | `ADMIN` | Update semester |

### Create Semester Body Example:
```json
{
  "name": "Year 2026 - Term 1 (Spring)",
  "academicYear": "2026",
  "startDate": "2026-01-01",
  "endDate": "2026-06-30",
  "isCurrent": true,
  "defaultMonthlyFee": 2500,
  "status": "ACTIVE"
}
```

---

## 6. 💵 Fee Configurations (`/api/fees`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/fees/student/:studentId/semester/:semesterId` | Authenticated | Get exact fee rate for student in a semester |
| `GET` | `/api/fees` | Authenticated | Query params: `semesterId`, `studentId`, `feeType` |
| `POST` | `/api/fees` | `ADMIN` | Create fee structure or student waiver/discount |
| `PATCH` | `/api/fees/:id` | `ADMIN` | Update fee structure |
| `DELETE` | `/api/fees/:id` | `ADMIN` | Delete fee structure |

---

## 7. 💳 Payment Engine (`/api/payments`)

### 7.1 Submit Payment (Guardian or Admin)
- **URL**: `POST /api/payments/submit`
- **Access**: `ADMIN`, `GUARDIAN`
- **Content-Type**: `multipart/form-data` (or JSON if no proof attachment)
- **Form Fields / JSON**:
```json
{
  "studentId": "66d6...",
  "semesterId": "66d6...",
  "month": "September",
  "year": 2026,
  "feeType": "MONTHLY",
  "amount": 2500,
  "paymentMethod": "BKASH", // 'BKASH' | 'NAGAD' | 'BANK' | 'OFFLINE'
  "transactionId": "BK9X2490LA", // for bKash/Nagad/Bank
  "senderPhone": "01713000001",  // for bKash/Nagad
  "bankName": "Islami Bank",     // for Bank
  "bankAccount": "2050123...",   // for Bank
  "offlineReceivedBy": "Ustadh Abu Bakr", // for Admin direct offline payment
  "note": "Payment submitted online",
  "proof": "(Binary File: Screenshot / Slip)" // field name: 'proof'
}
```
- **Response `(201 Created)`**:
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Payment submitted successfully",
  "data": {
    "_id": "66d6...",
    "receiptNo": "REC-202609-0001",
    "studentId": "66d6...",
    "amount": 2500,
    "expectedAmount": 2500,
    "paymentMethod": "BKASH",
    "status": "PENDING", // If OFFLINE submitted by ADMIN, automatically becomes 'VERIFIED'
    "paymentProof": "/uploads/proof-1725350000-12345.png"
  }
}
```

### 7.2 Verify or Reject Payment
- **URL**: `PATCH /api/payments/:id/verify`
- **Access**: `ADMIN`
- **Request Body**:
```json
{
  "status": "VERIFIED", // or "REJECTED"
  "rejectionReason": "Transaction ID did not match bank statement", // required if REJECTED
  "note": "Verified by Admin"
}
```

### 7.3 Get Guardian Personal Payment History
- **URL**: `GET /api/payments/my-payments`
- **Access**: `GUARDIAN`
- **Query Params**: `studentId`, `status`, `page`, `limit`

### 7.4 List All Payments (Admin)
- **URL**: `GET /api/payments`
- **Access**: `ADMIN`
- **Query Params**: `status`, `semesterId`, `studentId`, `guardianId`, `month`, `year`, `paymentMethod`, `search`, `startDate`, `endDate`, `page`, `limit`

---

## 8. 🧾 Expenses (`/api/expenses`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/expenses` | `ADMIN` | Query params: `category`, `month`, `year`, `startDate`, `endDate`, `search`, `page`, `limit`. Returns `totalAmount` along with records. |
| `POST` | `/api/expenses` | `ADMIN` | `multipart/form-data` with field `attachment` |
| `GET` | `/api/expenses/:id` | `ADMIN` | Get expense details |
| `PATCH` | `/api/expenses/:id` | `ADMIN` | Update expense |
| `DELETE` | `/api/expenses/:id` | `ADMIN` | Delete expense |

### Create Expense Example (`multipart/form-data`):
```
category: UTILITIES
title: Electricity & Generator Bill
amount: 4500
month: September
year: 2026
description: Monthly electric bill
voucherNo: VOUCH-001
attachment: (File: Receipt voucher image/PDF)
```

---

## 9. 👨‍🏫 Teachers & Salary (`/api/teachers`, `/api/teacher-salaries`)

### 9.1 Teacher Management (`/api/teachers`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/teachers/me` | `TEACHER` | Get logged-in teacher's profile |
| `GET` | `/api/teachers` | `ADMIN` | List all teachers |
| `POST` | `/api/teachers` | `ADMIN` | Create teacher (pass `createAccount: true, password: "..."`) |
| `PATCH` | `/api/teachers/:id` | `ADMIN` | Update teacher |

### 9.2 Teacher Salary (`/api/teacher-salaries`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/teacher-salaries/summary?month=September&year=2026` | `ADMIN` | View teacher paid vs due table for selected month |
| `POST` | `/api/teacher-salaries` | `ADMIN` | Pay salary (auto prevents duplicates & records expense) |
| `GET` | `/api/teacher-salaries/my-salary` | `TEACHER` | Teacher's personal salary history |
| `GET` | `/api/teacher-salaries` | `ADMIN` | List all salary disbursements |

### Pay Salary Body Example:
```json
{
  "teacherId": "66d6...",
  "month": "September",
  "year": 2026,
  "bonusAmount": 1000,
  "deductionAmount": 0,
  "paymentMethod": "BANK",
  "transactionRef": "IBBL-TXN-9912",
  "note": "Paid on time with bonus"
}
```

---

## 10. 📝 Student Exam Results (`/api/results`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/results/student/:studentId` | Authenticated | View exam results for a student (optional `?semesterId=...`) |
| `POST` | `/api/results` | `ADMIN`, `TEACHER` | Input student marks (auto calculates Grade `A+`, `A`, `B`, etc.) |
| `GET` | `/api/results` | Authenticated | Query params: `studentId`, `semesterId`, `examType`, `subject` |
| `PATCH` | `/api/results/:id` | `ADMIN`, `TEACHER` | Update marks |
| `DELETE` | `/api/results/:id` | `ADMIN` | Delete result |

### Create Result Body Example:
```json
{
  "studentId": "66d6...",
  "semesterId": "66d6...",
  "examType": "MONTHLY_TEST", // 'MONTHLY_TEST' | 'MIDTERM' | 'FINAL'
  "subject": "Quran Hifz",
  "totalMarks": 100,
  "marksObtained": 88,
  "remarks": "Excellent recitation and memorization"
}
```

---

## 11. 📄 Reports & PDF Exports (`/api/reports`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/reports/receipt/:paymentId/pdf` | Authenticated | **Direct PDF Download**: Official Money Receipt PDF for printing |
| `GET` | `/api/reports/financial-summary?format=pdf` | `ADMIN` | **Direct PDF Download**: Monthly Financial Statement PDF |
| `GET` | `/api/reports/financial-summary` | `ADMIN` | JSON response of monthly financial breakdown |
| `GET` | `/api/reports/monthly-payments` | `ADMIN` | Query params: `month`, `year`, `semesterId` |
| `GET` | `/api/reports/pending-payments` | `ADMIN` | List of students with unpaid dues for the month |
| `GET` | `/api/reports/expenses` | `ADMIN` | Categorized expense report with total sum |

---

## 12. 🔔 Notifications (`/api/notifications`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/notifications/my-notifications` | Authenticated | Query params: `unreadOnly=true`, `page`, `limit`. Returns `unreadCount` |
| `PATCH` | `/api/notifications/:id/read` | Authenticated | Mark single notification as read |
| `PATCH` | `/api/notifications/mark-all-read` | Authenticated | Mark all notifications as read |

---

## 13. 🛡️ Audit Logs (`/api/audit-logs`)

- **URL**: `GET /api/audit-logs`
- **Access**: `ADMIN`
- **Query Params**: `action`, `entity`, `actorId`, `startDate`, `endDate`, `page`, `limit`
- **Description**: Returns chronological log of administrative and financial activities.

---

## 14. ⚙️ System Settings (`/api/settings`)

### 14.1 Get Madrasa Settings
- **URL**: `GET /api/settings`
- **Access**: Public / Authenticated
- **Response**: Madrasa Name, Address, Contact, bKash & Nagad Merchant numbers, Bank Details, and Payment Instructions.

### 14.2 Update Madrasa Settings
- **URL**: `PATCH /api/settings`
- **Access**: `ADMIN`
- **Content-Type**: `multipart/form-data` with optional `logo` file
- **Form / JSON Fields**: `madrasaName`, `tagline`, `address`, `phone`, `email`, `website`, `bKashNumber`, `nagadNumber`, `bankDetails`, `paymentInstructions`, `defaultMonthlyFee`, `lateFeeRule`.

---

## 💡 Frontend Integration Pro-Tips

1. **Token Refresh Interceptor**: Use an Axios response interceptor on status `401` to call `POST /api/auth/refresh-token` with the stored `refreshToken`, update the `accessToken`, and retry the original request.
2. **Download PDF Receipts**: To trigger browser download for PDF endpoints, open the URL in a new tab with the Bearer token or fetch as `blob` and create an `<a>` download link:
   ```javascript
   const res = await axios.get(`/api/reports/receipt/${paymentId}/pdf`, {
     responseType: 'blob',
     headers: { Authorization: `Bearer ${token}` }
   });
   const url = window.URL.createObjectURL(new Blob([res.data]));
   const link = document.createElement('a');
   link.href = url;
   link.setAttribute('download', `Receipt-${paymentId}.pdf`);
   document.body.appendChild(link);
   link.click();
   ```
3. **Displaying Uploaded Images/Files**: For any file URL starting with `/uploads/...` (e.g. `paymentProof`, `avatar`, `attachmentUrl`), prefix with the backend server origin:
   ```javascript
   const fileUrl = `${API_ORIGIN}${payment.paymentProof}`;
   ```
