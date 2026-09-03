import mongoose from 'mongoose';
import { env } from '../config/env';
import { User } from '../modules/user/user.model';
import { SystemSetting } from '../modules/setting/setting.model';
import { Semester } from '../modules/semester/semester.model';
import { Guardian } from '../modules/guardian/guardian.model';
import { Student } from '../modules/student/student.model';
import { Teacher } from '../modules/teacher/teacher.model';
import { Payment } from '../modules/payment/payment.model';
import { Expense } from '../modules/expense/expense.model';
import { TeacherSalary } from '../modules/salary/salary.model';
import {
  UserRole,
  UserStatus,
  StudentStatus,
  PaymentMethod,
  PaymentStatus,
  ExpenseCategory,
  SalaryPaymentMethod,
  SalaryPaymentStatus,
  FeeType,
} from '../constants';

export const seedDatabase = async () => {
  try {
    console.log('⏳ Connecting to database for seeding...');
    await mongoose.connect(env.MONGO_URI);
    console.log('✅ Connected to database.');

    // 1. Seed System Settings
    console.log('🌱 Seeding System Settings...');
    let setting = await SystemSetting.findOne();
    if (!setting) {
      setting = await SystemSetting.create({
        madrasaName: 'Darul Uloom Islamic Academy',
        tagline: 'Center for Islamic Excellence & Character Building',
        address: 'House #12, Road #4, Dhanmondi, Dhaka - 1209, Bangladesh',
        phone: '+880 1711-000111',
        email: 'info@darululoom.edu.bd',
        website: 'https://darululoom.edu.bd',
        currency: 'BDT',
        bKashNumber: '01711000111 (Merchant)',
        nagadNumber: '01711000222 (Merchant)',
        bankDetails: {
          bankName: 'Islami Bank Bangladesh Ltd',
          accountName: 'Darul Uloom Islamic Academy',
          accountNumber: '2050123456789012',
          branchName: 'Dhanmondi Branch',
          routingNumber: '125271234',
        },
        paymentInstructions:
          'Please send fee via bKash/Nagad Merchant or Deposit to Islami Bank Account. Enter the correct Transaction ID or upload deposit slip while submitting fee payment.',
        defaultMonthlyFee: 2500,
        lateFeeRule: {
          enabled: true,
          dueDayOfMonth: 10,
          fineAmount: 100,
        },
      });
      console.log('✅ System Settings seeded.');
    }

    // 2. Seed Admin User
    console.log('🌱 Seeding Admin User...');
    let admin = await User.findOne({ email: 'admin@madrasah.com' });
    if (!admin) {
      admin = await User.create({
        name: 'Super Admin',
        email: 'admin@madrasah.com',
        phone: '01700000000',
        password: 'admin123456',
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
      });
      console.log('✅ Default Admin created: admin@madrasah.com / admin123456');
    }

    // 3. Seed Current Semester
    console.log('🌱 Seeding Semesters...');
    let semester = await Semester.findOne({ isCurrent: true });
    if (!semester) {
      semester = await Semester.create({
        name: 'Year 2026 - Term 1 (Spring)',
        academicYear: '2026',
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-06-30'),
        isCurrent: true,
        defaultMonthlyFee: 2500,
        status: 'ACTIVE',
      });
      console.log('✅ Active Semester created.');
    }

    // 4. Seed Teacher
    console.log('🌱 Seeding Teachers...');
    let teacher = await Teacher.findOne({ phone: '01712000001' });
    if (!teacher) {
      teacher = await Teacher.create({
        teacherId: 'TCH-001',
        name: 'Maulana Abdullah Al-Mamun',
        phone: '01712000001',
        email: 'teacher@madrasah.com',
        address: 'Dhaka, Bangladesh',
        subjects: ['Quran Hifz', 'Tajweed', 'Hadith'],
        fixedMonthlySalary: 25000,
        joiningDate: new Date('2024-01-01'),
        status: 'ACTIVE',
      });

      const teacherUser = await User.create({
        name: teacher.name,
        email: teacher.email,
        phone: teacher.phone,
        password: 'teacher123456',
        role: UserRole.TEACHER,
        status: UserStatus.ACTIVE,
        teacherId: teacher._id,
      });

      teacher.userId = teacherUser._id;
      await teacher.save();
      console.log('✅ Teacher created: teacher@madrasah.com / teacher123456');
    }

    // 5. Seed Guardian
    console.log('🌱 Seeding Guardians...');
    let guardian = await Guardian.findOne({ phone: '01713000001' });
    if (!guardian) {
      guardian = await Guardian.create({
        name: 'Mohammad Rahim Uddin',
        phone: '01713000001',
        email: 'guardian@madrasah.com',
        address: 'Mirpur, Dhaka',
        occupation: 'Businessman',
        relation: 'Father',
        nid: '19852691234567',
        status: 'ACTIVE',
        students: [],
      });

      const guardianUser = await User.create({
        name: guardian.name,
        email: guardian.email,
        phone: guardian.phone,
        password: 'guardian123456',
        role: UserRole.GUARDIAN,
        status: UserStatus.ACTIVE,
        guardianId: guardian._id,
      });

      guardian.userId = guardianUser._id;
      await guardian.save();
      console.log('✅ Guardian created: guardian@madrasah.com / guardian123456');
    }

    // 6. Seed Students
    console.log('🌱 Seeding Students...');
    let student = await Student.findOne({ rollNumber: '101' });
    if (!student) {
      student = await Student.create({
        admissionId: 'STU-2026-0001',
        name: 'Ahmed Hasan',
        arabicName: 'أحمد حسن',
        classProgram: 'Hifz Section A',
        rollNumber: '101',
        gender: 'MALE',
        dateOfBirth: new Date('2014-05-15'),
        admissionDate: new Date('2025-01-10'),
        currentSemester: semester!._id,
        guardianId: guardian!._id,
        monthlyFee: 2500,
        status: StudentStatus.ACTIVE,
        bloodGroup: 'B+',
        address: 'Mirpur, Dhaka',
      });

      guardian!.students = [student._id as any];
      await guardian!.save();
      console.log('✅ Student created: Ahmed Hasan (STU-2026-0001)');
    }

    // 7. Seed Sample Verified Payment
    console.log('🌱 Seeding Sample Payments...');
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const currentYear = new Date().getFullYear();

    const existingPayment = await Payment.findOne({
      studentId: student!._id,
      month: currentMonth,
      year: currentYear,
    });

    if (!existingPayment) {
      await Payment.create({
        receiptNo: `REC-${currentYear}09-0001`,
        studentId: student!._id,
        guardianId: guardian!._id,
        semesterId: semester!._id,
        month: currentMonth,
        year: currentYear,
        feeType: FeeType.MONTHLY,
        amount: 2500,
        expectedAmount: 2500,
        paymentMethod: PaymentMethod.BKASH,
        transactionId: 'BK9X2490LA',
        senderPhone: '01713000001',
        status: PaymentStatus.VERIFIED,
        verifiedBy: admin!._id,
        verifiedAt: new Date(),
        submittedBy: admin!._id,
        note: 'Initial verified fee collection demo',
      });
      console.log('✅ Sample Verified Payment created.');
    }

    // 8. Seed Sample Expenses
    console.log('🌱 Seeding Sample Expenses...');
    const existingExpense = await Expense.findOne({ title: { $regex: /Electricity/i } });
    if (!existingExpense) {
      await Expense.create({
        category: ExpenseCategory.UTILITIES,
        title: 'Electricity & Generator Bill',
        amount: 4500,
        date: new Date(),
        month: currentMonth,
        year: currentYear,
        description: 'Monthly electricity and power utility bill',
        voucherNo: 'VOUCH-2026-001',
        createdBy: admin!._id,
      });
      console.log('✅ Sample Utility Expense created.');
    }

    // 9. Seed Sample Salary Payment
    console.log('🌱 Seeding Sample Salary Payment...');
    const existingSalary = await TeacherSalary.findOne({
      teacherId: teacher!._id,
      month: currentMonth,
      year: currentYear,
    });

    if (!existingSalary) {
      await TeacherSalary.create({
        receiptNo: `SAL-${currentYear}09-0001`,
        teacherId: teacher!._id,
        month: currentMonth,
        year: currentYear,
        fixedSalarySnapshot: teacher!.fixedMonthlySalary,
        bonusAmount: 1000,
        deductionAmount: 0,
        netAmount: teacher!.fixedMonthlySalary + 1000,
        paymentDate: new Date(),
        paymentMethod: SalaryPaymentMethod.BANK,
        transactionRef: 'IBBL-FT-99231',
        status: SalaryPaymentStatus.PAID,
        paidBy: admin!._id,
        note: 'Monthly salary plus Ramadan advance bonus',
      });
      console.log('✅ Sample Teacher Salary recorded.');
    }

    console.log('\n🎉 ALL DATABASE SEEDING COMPLETED SUCCESSFULLY! 🎉\n');
    console.log('---------------------------------------------------------');
    console.log('🔑 TEST LOGIN CREDENTIALS:');
    console.log('👤 Admin:    admin@madrasah.com    / admin123456');
    console.log('👨‍🏫 Teacher:  teacher@madrasah.com  / teacher123456');
    console.log('👨‍👦 Guardian: guardian@madrasah.com / guardian123456');
    console.log('---------------------------------------------------------\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

// Auto-run if executed directly
if (require.main === module) {
  seedDatabase();
}
