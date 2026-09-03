import { TeacherSalary } from './salary.model';
import { Teacher } from '../teacher/teacher.model';
import { Expense } from '../expense/expense.model';
import { Notification } from '../notification/notification.model';
import { AuditLog } from '../audit/audit.model';
import { ApiError } from '../../utils/apiError';
import { ExpenseCategory, NotificationType, SalaryPaymentStatus } from '../../constants';
import type { ITeacherSalary } from './salary.interface';
import type { AuthUser } from '../../middlewares/auth.middleware';

const generateSalaryReceiptNo = async (year: number): Promise<string> => {
  const monthNum = (new Date().getMonth() + 1).toString().padStart(2, '0');
  const prefix = `SAL-${year}${monthNum}`;
  const count = await TeacherSalary.countDocuments({
    receiptNo: { $regex: `^${prefix}` },
  });
  const seq = (count + 1).toString().padStart(4, '0');
  return `${prefix}-${seq}`;
};

export const paySalaryService = async (
  payload: Partial<ITeacherSalary>,
  currentUser: AuthUser
) => {
  const { teacherId, month, year, bonusAmount = 0, deductionAmount = 0 } = payload;

  if (!teacherId || !month || !year) {
    throw new ApiError(400, 'Teacher ID, month, and year are required');
  }

  const teacher = await Teacher.findById(teacherId);
  if (!teacher) {
    throw new ApiError(404, 'Teacher not found');
  }

  // Check duplicate
  const existingSalary = await TeacherSalary.findOne({
    teacherId,
    month,
    year,
  });

  if (existingSalary) {
    throw new ApiError(
      400,
      `Salary for ${teacher.name} for ${month} ${year} has already been recorded (Receipt: ${existingSalary.receiptNo}).`
    );
  }

  const fixedSalarySnapshot = teacher.fixedMonthlySalary;
  const netAmount = payload.netAmount !== undefined
    ? payload.netAmount
    : Math.max(0, fixedSalarySnapshot + bonusAmount - deductionAmount);

  const receiptNo = await generateSalaryReceiptNo(year);

  const salaryPayment = await TeacherSalary.create({
    ...payload,
    receiptNo,
    fixedSalarySnapshot,
    bonusAmount,
    deductionAmount,
    netAmount,
    paidBy: currentUser.userId,
    status: payload.status || SalaryPaymentStatus.PAID,
  });

  // Auto record as Expense under category 'SALARY'
  if (salaryPayment.status === SalaryPaymentStatus.PAID) {
    await Expense.create({
      category: ExpenseCategory.SALARY,
      title: `Teacher Salary: ${teacher.name} (${month} ${year})`,
      amount: netAmount,
      date: salaryPayment.paymentDate || new Date(),
      month,
      year,
      description: `Auto-generated salary expense for ${teacher.name} (${teacher.teacherId}). Receipt: ${receiptNo}`,
      voucherNo: receiptNo,
      createdBy: currentUser.userId,
    });
  }

  // Audit Log
  await AuditLog.create({
    actor: currentUser.userId,
    actorRole: currentUser.role,
    action: 'PAY_TEACHER_SALARY',
    entity: 'TeacherSalary',
    entityId: salaryPayment._id.toString(),
    details: {
      receiptNo,
      teacherId: teacher._id,
      teacherName: teacher.name,
      month,
      year,
      netAmount,
    },
  });

  // Send Notification to Teacher
  if (teacher.userId) {
    await Notification.create({
      recipient: teacher.userId,
      title: 'Salary Paid 💵',
      message: `Your salary of ৳${netAmount} for ${month} ${year} has been processed. Receipt: ${receiptNo}`,
      type: NotificationType.SALARY_PAID,
      link: `/teacher/salaries/${salaryPayment._id}`,
      metadata: { salaryId: salaryPayment._id, receiptNo },
    });
  }

  return salaryPayment;
};

export const getAllSalaryPaymentsService = async (query: {
  teacherId?: string;
  month?: string;
  year?: string;
  status?: string;
  page?: number;
  limit?: number;
}) => {
  const { teacherId, month, year, status, page = 1, limit = 10 } = query;
  const filter: any = {};

  if (teacherId) filter.teacherId = teacherId;
  if (month) filter.month = month;
  if (year) filter.year = Number(year);
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const total = await TeacherSalary.countDocuments(filter);

  const totalAmountAgg = await TeacherSalary.aggregate([
    { $match: filter },
    { $group: { _id: null, totalNetAmount: { $sum: '$netAmount' } } },
  ]);
  const totalNetAmount = totalAmountAgg[0]?.totalNetAmount || 0;

  const salaryPayments = await TeacherSalary.find(filter)
    .populate('teacherId', 'name teacherId phone subjects fixedMonthlySalary')
    .populate('paidBy', 'name email')
    .sort({ paymentDate: -1 })
    .skip(skip)
    .limit(Number(limit));

  return {
    salaryPayments,
    totalNetAmount,
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

export const getSalaryPaymentByIdService = async (id: string) => {
  const salaryPayment = await TeacherSalary.findById(id)
    .populate('teacherId')
    .populate('paidBy', 'name email');

  if (!salaryPayment) {
    throw new ApiError(404, 'Salary payment record not found');
  }

  return salaryPayment;
};

export const getTeacherSalarySummaryService = async (month: string, year: number) => {
  const activeTeachers = await Teacher.find({ status: 'ACTIVE' });
  const paidSalaries = await TeacherSalary.find({ month, year });

  const paidMap = new Map();
  paidSalaries.forEach((sal) => {
    paidMap.set(sal.teacherId.toString(), sal);
  });

  let totalExpectedSalary = 0;
  let totalPaidSalary = 0;
  let totalDueSalary = 0;

  const summary = activeTeachers.map((teacher) => {
    const isPaid = paidMap.has(teacher._id.toString());
    const salaryRecord = paidMap.get(teacher._id.toString());
    const amountPaid = isPaid ? salaryRecord.netAmount : 0;
    const dueAmount = isPaid ? 0 : teacher.fixedMonthlySalary;

    totalExpectedSalary += teacher.fixedMonthlySalary;
    totalPaidSalary += amountPaid;
    totalDueSalary += dueAmount;

    return {
      teacherId: teacher._id,
      teacherCode: teacher.teacherId,
      name: teacher.name,
      phone: teacher.phone,
      fixedSalary: teacher.fixedMonthlySalary,
      isPaid,
      paidAmount: amountPaid,
      dueAmount,
      receiptNo: salaryRecord?.receiptNo,
      paymentDate: salaryRecord?.paymentDate,
      paymentMethod: salaryRecord?.paymentMethod,
    };
  });

  return {
    month,
    year,
    totalTeachers: activeTeachers.length,
    totalExpectedSalary,
    totalPaidSalary,
    totalDueSalary,
    teachers: summary,
  };
};

export const getMySalaryHistoryService = async (
  userId: string,
  query: { page?: number; limit?: number }
) => {
  const teacher = await Teacher.findOne({ userId });
  if (!teacher) {
    throw new ApiError(404, 'Teacher profile not found');
  }

  return getAllSalaryPaymentsService({
    ...query,
    teacherId: teacher._id.toString(),
  });
};
