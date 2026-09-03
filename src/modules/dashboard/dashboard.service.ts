import { Student } from '../student/student.model';
import { Guardian } from '../guardian/guardian.model';
import { Semester } from '../semester/semester.model';
import { Payment } from '../payment/payment.model';
import { Expense } from '../expense/expense.model';
import { Teacher } from '../teacher/teacher.model';
import { TeacherSalary } from '../salary/salary.model';
import { StudentResult } from '../result/result.model';
import { Notification } from '../notification/notification.model';
import { PaymentStatus, PaymentMethod, StudentStatus, SalaryPaymentStatus } from '../../constants';

export const getAdminDashboardSummaryService = async (query: {
  month?: string;
  year?: number;
  semesterId?: string;
}) => {
  const currentMonth = query.month || new Date().toLocaleString('default', { month: 'long' });
  const currentYear = query.year || new Date().getFullYear();

  // Find active or target semester
  let targetSemester = null;
  if (query.semesterId) {
    targetSemester = await Semester.findById(query.semesterId);
  } else {
    targetSemester = await Semester.findOne({ isCurrent: true, status: 'ACTIVE' });
    if (!targetSemester) {
      targetSemester = await Semester.findOne().sort({ createdAt: -1 });
    }
  }

  // 1. Total active students
  const studentFilter: any = { status: StudentStatus.ACTIVE };
  if (targetSemester) {
    studentFilter.currentSemester = targetSemester._id;
  }
  const totalActiveStudents = await Student.countDocuments(studentFilter);
  const activeStudents = await Student.find(studentFilter).select('_id name monthlyFee');

  // Total expected collection for selected month
  let totalExpectedCollection = 0;
  activeStudents.forEach((s) => {
    totalExpectedCollection += s.monthlyFee || (targetSemester?.defaultMonthlyFee || 0);
  });

  // 2. Verified payments for selected month & year
  const paymentFilter: any = {
    month: currentMonth,
    year: currentYear,
    status: PaymentStatus.VERIFIED,
  };
  if (targetSemester) {
    paymentFilter.semesterId = targetSemester._id;
  }

  const verifiedPayments = await Payment.find(paymentFilter);
  const totalVerifiedCollection = verifiedPayments.reduce((acc, p) => acc + p.amount, 0);

  // Set of paid student IDs
  const paidStudentIdSet = new Set(
    verifiedPayments.map((p) => p.studentId.toString())
  );

  const totalPaidStudentsCount = paidStudentIdSet.size;
  const totalPendingStudentsCount = Math.max(0, totalActiveStudents - totalPaidStudentsCount);
  const totalPendingAmount = Math.max(0, totalExpectedCollection - totalVerifiedCollection);

  // 3. Monthly expenses
  const expenseFilter = { month: currentMonth, year: currentYear };
  const monthlyExpenses = await Expense.find(expenseFilter);
  const totalMonthlyExpenses = monthlyExpenses.reduce((acc, e) => acc + e.amount, 0);

  // 4. Net balance
  const netBalance = totalVerifiedCollection - totalMonthlyExpenses;

  // 5. Payment method breakdown
  const methodBreakdown = {
    [PaymentMethod.BKASH]: 0,
    [PaymentMethod.NAGAD]: 0,
    [PaymentMethod.BANK]: 0,
    [PaymentMethod.OFFLINE]: 0,
  };
  verifiedPayments.forEach((p) => {
    if (methodBreakdown[p.paymentMethod] !== undefined) {
      methodBreakdown[p.paymentMethod] += p.amount;
    }
  });

  // 6. Pending verification queue
  const pendingPaymentsQueue = await Payment.find({ status: PaymentStatus.PENDING })
    .populate('studentId', 'name admissionId rollNumber classProgram')
    .populate('guardianId', 'name phone')
    .sort({ createdAt: -1 })
    .limit(10);

  const totalPendingVerificationCount = await Payment.countDocuments({
    status: PaymentStatus.PENDING,
  });

  // 7. Recent Verified Payments
  const recentPayments = await Payment.find({ status: PaymentStatus.VERIFIED })
    .populate('studentId', 'name admissionId rollNumber')
    .sort({ verifiedAt: -1, createdAt: -1 })
    .limit(10);

  // 8. Recent Expenses
  const recentExpenses = await Expense.find()
    .sort({ date: -1, createdAt: -1 })
    .limit(10);

  // 9. Teacher salary summary for selected month
  const totalTeachers = await Teacher.countDocuments({ status: 'ACTIVE' });
  const teachers = await Teacher.find({ status: 'ACTIVE' }).select('_id fixedMonthlySalary');
  const totalExpectedTeacherSalaries = teachers.reduce((acc, t) => acc + t.fixedMonthlySalary, 0);

  const paidTeacherSalaries = await TeacherSalary.find({
    month: currentMonth,
    year: currentYear,
    status: SalaryPaymentStatus.PAID,
  });
  const totalPaidTeacherSalaries = paidTeacherSalaries.reduce((acc, s) => acc + s.netAmount, 0);
  const totalDueTeacherSalaries = Math.max(
    0,
    totalExpectedTeacherSalaries - totalPaidTeacherSalaries
  );

  return {
    period: {
      month: currentMonth,
      year: currentYear,
      semester: targetSemester ? { id: targetSemester._id, name: targetSemester.name } : null,
    },
    students: {
      totalActiveStudents,
      totalPaidStudents: totalPaidStudentsCount,
      totalPendingStudents: totalPendingStudentsCount,
    },
    financials: {
      totalExpectedCollection,
      totalVerifiedCollection,
      totalPendingAmount,
      totalMonthlyExpenses,
      netBalance,
    },
    paymentMethods: methodBreakdown,
    teachers: {
      totalActiveTeachers: totalTeachers,
      totalExpectedSalary: totalExpectedTeacherSalaries,
      totalPaidSalary: totalPaidTeacherSalaries,
      totalDueSalary: totalDueTeacherSalaries,
    },
    pendingVerificationQueue: {
      count: totalPendingVerificationCount,
      items: pendingPaymentsQueue,
    },
    recentPayments,
    recentExpenses,
  };
};

export const getGuardianDashboardSummaryService = async (userId: string) => {
  const guardian = await Guardian.findOne({ userId }).populate({
    path: 'students',
    populate: { path: 'currentSemester' },
  });

  if (!guardian) {
    return {
      guardian: null,
      students: [],
      recentPayments: [],
      unreadNotificationsCount: 0,
    };
  }

  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();

  const studentsSummary = await Promise.all(
    (guardian.students || []).map(async (studentDoc: any) => {
      const student = studentDoc;
      const verifiedPayment = await Payment.findOne({
        studentId: student._id,
        month: currentMonth,
        year: currentYear,
        status: PaymentStatus.VERIFIED,
      });

      const pendingPayment = await Payment.findOne({
        studentId: student._id,
        month: currentMonth,
        year: currentYear,
        status: PaymentStatus.PENDING,
      });

      let currentMonthStatus = 'UNPAID';
      if (verifiedPayment) currentMonthStatus = 'PAID';
      else if (pendingPayment) currentMonthStatus = 'PENDING_VERIFICATION';

      const recentResults = await StudentResult.find({ studentId: student._id })
        .sort({ createdAt: -1 })
        .limit(5);

      return {
        studentId: student._id,
        admissionId: student.admissionId,
        name: student.name,
        classProgram: student.classProgram,
        rollNumber: student.rollNumber,
        semester: student.currentSemester,
        monthlyFee: student.monthlyFee,
        currentMonthStatus,
        paymentDetails: verifiedPayment || pendingPayment || null,
        recentResults,
      };
    })
  );

  const recentPayments = await Payment.find({ guardianId: guardian._id })
    .populate('studentId', 'name admissionId')
    .sort({ createdAt: -1 })
    .limit(10);

  const unreadNotificationsCount = await Notification.countDocuments({
    recipient: userId,
    readStatus: false,
  });

  return {
    guardian: {
      id: guardian._id,
      name: guardian.name,
      phone: guardian.phone,
      email: guardian.email,
    },
    currentMonth,
    currentYear,
    students: studentsSummary,
    recentPayments,
    unreadNotificationsCount,
  };
};

export const getTeacherDashboardSummaryService = async (userId: string) => {
  const teacher = await Teacher.findOne({ userId });
  if (!teacher) {
    return {
      teacher: null,
      currentSalaryStatus: null,
      recentSalaries: [],
      assignedSubjects: [],
    };
  }

  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();

  const currentSalary = await TeacherSalary.findOne({
    teacherId: teacher._id,
    month: currentMonth,
    year: currentYear,
  });

  const recentSalaries = await TeacherSalary.find({ teacherId: teacher._id })
    .sort({ paymentDate: -1 })
    .limit(12);

  const unreadNotificationsCount = await Notification.countDocuments({
    recipient: userId,
    readStatus: false,
  });

  return {
    teacher: {
      id: teacher._id,
      teacherId: teacher.teacherId,
      name: teacher.name,
      phone: teacher.phone,
      subjects: teacher.subjects,
      fixedMonthlySalary: teacher.fixedMonthlySalary,
      status: teacher.status,
    },
    period: {
      month: currentMonth,
      year: currentYear,
    },
    currentSalaryStatus: {
      isPaid: !!currentSalary && currentSalary.status === SalaryPaymentStatus.PAID,
      salaryRecord: currentSalary || null,
    },
    recentSalaries,
    unreadNotificationsCount,
  };
};

export const getFinancialTrendsService = async (year?: number) => {
  const targetYear = year || new Date().getFullYear();

  // Aggregate monthly verified collections
  const monthlyCollections = await Payment.aggregate([
    {
      $match: {
        year: targetYear,
        status: PaymentStatus.VERIFIED,
      },
    },
    {
      $group: {
        _id: '$month',
        totalCollected: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
  ]);

  // Aggregate monthly expenses
  const monthlyExpenses = await Expense.aggregate([
    {
      $match: {
        year: targetYear,
      },
    },
    {
      $group: {
        _id: '$month',
        totalExpense: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
  ]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const collectionMap = new Map();
  monthlyCollections.forEach((c) => collectionMap.set(c._id, c.totalCollected));

  const expenseMap = new Map();
  monthlyExpenses.forEach((e) => expenseMap.set(e._id, e.totalExpense));

  const trends = months.map((m) => {
    const collected = collectionMap.get(m) || 0;
    const expense = expenseMap.get(m) || 0;
    return {
      month: m,
      year: targetYear,
      collection: collected,
      expense,
      net: collected - expense,
    };
  });

  return {
    year: targetYear,
    trends,
  };
};
