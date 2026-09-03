import { Payment } from '../payment/payment.model';
import { Student } from '../student/student.model';
import { Semester } from '../semester/semester.model';
import { Expense } from '../expense/expense.model';
import { TeacherSalary } from '../salary/salary.model';
import { PaymentStatus, StudentStatus } from '../../constants';

export const getMonthlyPaymentReportService = async (query: {
  month: string;
  year: number;
  semesterId?: string;
}) => {
  const { month, year, semesterId } = query;
  const filter: any = {
    month,
    year,
    status: PaymentStatus.VERIFIED,
  };

  if (semesterId) {
    filter.semesterId = semesterId;
  }

  const payments = await Payment.find(filter)
    .populate('studentId', 'name admissionId classProgram rollNumber')
    .populate('guardianId', 'name phone')
    .populate('semesterId', 'name academicYear')
    .sort({ createdAt: -1 });

  const totalCollected = payments.reduce((acc, p) => acc + p.amount, 0);

  return {
    month,
    year,
    totalRecords: payments.length,
    totalCollected,
    payments,
  };
};

export const getPendingPaymentReportService = async (query: {
  month: string;
  year: number;
  semesterId?: string;
}) => {
  const { month, year, semesterId } = query;

  // 1. Get all active students
  const studentFilter: any = { status: StudentStatus.ACTIVE };
  if (semesterId) {
    studentFilter.currentSemester = semesterId;
  }

  const activeStudents = await Student.find(studentFilter)
    .populate('guardianId', 'name phone email')
    .populate('currentSemester', 'name defaultMonthlyFee')
    .sort({ classProgram: 1, rollNumber: 1 });

  // 2. Get all verified payments for this month & year
  const paymentFilter: any = {
    month,
    year,
    status: PaymentStatus.VERIFIED,
  };
  if (semesterId) {
    paymentFilter.semesterId = semesterId;
  }

  const verifiedPayments = await Payment.find(paymentFilter).select('studentId amount receiptNo');
  const paidMap = new Map();
  verifiedPayments.forEach((p) => paidMap.set(p.studentId.toString(), p));

  // 3. Filter pending students
  let totalPendingAmount = 0;
  const pendingStudents = activeStudents
    .filter((student) => !paidMap.has(student._id.toString()))
    .map((student) => {
      const dueAmount = student.monthlyFee || (student.currentSemester as any)?.defaultMonthlyFee || 0;
      totalPendingAmount += dueAmount;
      return {
        studentId: student._id,
        admissionId: student.admissionId,
        name: student.name,
        classProgram: student.classProgram,
        rollNumber: student.rollNumber,
        guardianName: (student.guardianId as any)?.name || 'N/A',
        guardianPhone: (student.guardianId as any)?.phone || 'N/A',
        dueAmount,
      };
    });

  return {
    month,
    year,
    totalPendingStudents: pendingStudents.length,
    totalPendingAmount,
    students: pendingStudents,
  };
};

export const getExpenseReportService = async (query: {
  month?: string;
  year?: number;
  category?: string;
}) => {
  const { month, year, category } = query;
  const filter: any = {};

  if (month) filter.month = month;
  if (year) filter.year = year;
  if (category) filter.category = category;

  const expenses = await Expense.find(filter)
    .populate('createdBy', 'name email')
    .sort({ date: -1 });

  const totalExpenseAmount = expenses.reduce((acc, e) => acc + e.amount, 0);

  // Group by category
  const categoryBreakdown: Record<string, number> = {};
  expenses.forEach((e) => {
    categoryBreakdown[e.category] = (categoryBreakdown[e.category] || 0) + e.amount;
  });

  return {
    month: month || 'All',
    year: year || 'All',
    totalRecords: expenses.length,
    totalExpenseAmount,
    categoryBreakdown,
    expenses,
  };
};
