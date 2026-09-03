export enum UserRole {
  ADMIN = 'ADMIN',
  GUARDIAN = 'GUARDIAN',
  TEACHER = 'TEACHER',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum StudentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  GRADUATED = 'GRADUATED',
}

export enum PaymentMethod {
  BKASH = 'BKASH',
  NAGAD = 'NAGAD',
  BANK = 'BANK',
  OFFLINE = 'OFFLINE',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum FeeType {
  MONTHLY = 'MONTHLY',
  ADMISSION = 'ADMISSION',
  EXAM = 'EXAM',
  SESSION = 'SESSION',
  OTHER = 'OTHER',
}

export enum ExpenseCategory {
  UTILITIES = 'UTILITIES',
  FOOD = 'FOOD',
  MAINTENANCE = 'MAINTENANCE',
  SUPPLIES = 'SUPPLIES',
  TRANSPORT = 'TRANSPORT',
  SALARY = 'SALARY',
  RENT = 'RENT',
  OTHER = 'OTHER',
}

export enum SalaryPaymentMethod {
  CASH = 'CASH',
  BANK = 'BANK',
  BKASH = 'BKASH',
  NAGAD = 'NAGAD',
}

export enum SalaryPaymentStatus {
  PAID = 'PAID',
  PENDING = 'PENDING',
}

export enum NotificationType {
  PAYMENT_VERIFIED = 'PAYMENT_VERIFIED',
  PAYMENT_REJECTED = 'PAYMENT_REJECTED',
  SALARY_PAID = 'SALARY_PAID',
  NOTICE = 'NOTICE',
  RESULT_PUBLISHED = 'RESULT_PUBLISHED',
  GENERAL = 'GENERAL',
}

export enum ExamType {
  MONTHLY_TEST = 'MONTHLY_TEST',
  MIDTERM = 'MIDTERM',
  FINAL = 'FINAL',
}
