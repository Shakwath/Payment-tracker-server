import { Payment } from './payment.model';
import { Student } from '../student/student.model';
import { Guardian } from '../guardian/guardian.model';
import { Semester } from '../semester/semester.model';
import { User } from '../user/user.model';
import { Notification } from '../notification/notification.model';
import { AuditLog } from '../audit/audit.model';
import { getFeeForStudentService } from '../fee/fee.service';
import { ApiError } from '../../utils/apiError';
import { PaymentStatus, PaymentMethod, UserRole, NotificationType, FeeType } from '../../constants';
import type { IPayment } from './payment.interface';
import type { AuthUser } from '../../middlewares/auth.middleware';

const generateReceiptNo = async (year: number): Promise<string> => {
  const monthNum = (new Date().getMonth() + 1).toString().padStart(2, '0');
  const prefix = `REC-${year}${monthNum}`;
  const count = await Payment.countDocuments({
    receiptNo: { $regex: `^${prefix}` },
  });
  const seq = (count + 1).toString().padStart(4, '0');
  return `${prefix}-${seq}`;
};

export const submitPaymentService = async (
  payload: Partial<IPayment>,
  currentUser: AuthUser,
  proofAttachmentUrl?: string
) => {
  const { studentId, semesterId, month, year, feeType = FeeType.MONTHLY, paymentMethod } = payload;

  if (!studentId || !semesterId || !month || !year || !paymentMethod) {
    throw new ApiError(400, 'Student, semester, month, year, and payment method are required');
  }

  // Validate student
  const student = await Student.findById(studentId);
  if (!student) {
    throw new ApiError(404, 'Student not found');
  }

  // Validate semester
  const semester = await Semester.findById(semesterId);
  if (!semester) {
    throw new ApiError(404, 'Semester not found');
  }

  // Guardian authorization check if current user is guardian
  let guardianId = payload.guardianId || student.guardianId;
  if (currentUser.role === UserRole.GUARDIAN) {
    const guardian = await Guardian.findOne({ userId: currentUser.userId });
    if (!guardian) {
      throw new ApiError(404, 'Guardian profile not found');
    }
    guardianId = guardian._id;
  }

  // Check duplicate payments
  const existingVerified = await Payment.findOne({
    studentId,
    semesterId,
    month,
    year,
    feeType,
    status: PaymentStatus.VERIFIED,
  });

  if (existingVerified) {
    throw new ApiError(
      400,
      `A verified payment for ${student.name} (${month} ${year}) has already been recorded (Receipt: ${existingVerified.receiptNo}).`
    );
  }

  const existingPending = await Payment.findOne({
    studentId,
    semesterId,
    month,
    year,
    feeType,
    status: PaymentStatus.PENDING,
  });

  if (existingPending) {
    throw new ApiError(
      400,
      `A payment submission for ${student.name} (${month} ${year}) is already pending verification.`
    );
  }

  // Determine expected fee
  const feeInfo = await getFeeForStudentService(studentId.toString(), semesterId.toString());
  const expectedAmount = feeInfo.monthlyFee;

  // Generate Receipt Number
  const receiptNo = await generateReceiptNo(year);

  // Set initial status
  let initialStatus = PaymentStatus.PENDING;
  let verifiedBy = undefined;
  let verifiedAt = undefined;

  // If Admin is submitting directly as OFFLINE payment, automatically mark as VERIFIED
  if (currentUser.role === UserRole.ADMIN && paymentMethod === PaymentMethod.OFFLINE) {
    initialStatus = PaymentStatus.VERIFIED;
    verifiedBy = currentUser.userId as any;
    verifiedAt = new Date();
  }

  const paymentData: Partial<IPayment> = {
    ...payload,
    receiptNo,
    guardianId,
    expectedAmount,
    status: initialStatus,
    verifiedBy,
    verifiedAt,
    paymentProof: proofAttachmentUrl || payload.paymentProof || '',
    submittedBy: currentUser.userId as any,
  };

  const payment = await Payment.create(paymentData);

  // Send Notification & Audit Log
  if (currentUser.role === UserRole.GUARDIAN) {
    // Notify all admins about new payment submission
    const admins = await User.find({ role: UserRole.ADMIN });
    const notifications = admins.map((admin) => ({
      recipient: admin._id,
      title: 'New Payment Submitted',
      message: `Guardian submitted ৳${payment.amount} via ${payment.paymentMethod} for student ${student.name} (${month} ${year}).`,
      type: NotificationType.GENERAL,
      link: `/payments/${payment._id}`,
      metadata: { paymentId: payment._id, receiptNo: payment.receiptNo },
    }));
    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }
  } else if (currentUser.role === UserRole.ADMIN) {
    // Audit Log for Admin direct payment entry
    await AuditLog.create({
      actor: currentUser.userId,
      actorRole: currentUser.role,
      action: 'DIRECT_PAYMENT_ENTRY',
      entity: 'Payment',
      entityId: payment._id.toString(),
      details: {
        receiptNo: payment.receiptNo,
        amount: payment.amount,
        studentId: student._id,
        studentName: student.name,
        month,
        year,
      },
    });

    // Notify Guardian about verified payment
    const guardian = await Guardian.findById(guardianId);
    if (guardian?.userId) {
      await Notification.create({
        recipient: guardian.userId,
        title: 'Payment Recorded & Verified',
        message: `A payment of ৳${payment.amount} for ${student.name} (${month} ${year}) has been recorded. Receipt: ${payment.receiptNo}`,
        type: NotificationType.PAYMENT_VERIFIED,
        link: `/payments/${payment._id}`,
        metadata: { paymentId: payment._id, receiptNo: payment.receiptNo },
      });
    }
  }

  return payment;
};

export const verifyPaymentService = async (
  paymentId: string,
  currentUser: AuthUser,
  payload: { status: PaymentStatus; rejectionReason?: string; note?: string }
) => {
  const payment = await Payment.findById(paymentId)
    .populate('studentId', 'name admissionId')
    .populate('guardianId', 'name phone userId');

  if (!payment) {
    throw new ApiError(404, 'Payment record not found');
  }

  const prevStatus = payment.status;
  payment.status = payload.status;
  payment.verifiedBy = currentUser.userId as any;
  payment.verifiedAt = new Date();

  if (payload.status === PaymentStatus.REJECTED) {
    payment.rejectionReason = payload.rejectionReason || 'Payment rejected by administrator.';
  }

  if (payload.note) {
    payment.note = payload.note;
  }

  await payment.save();

  // Audit Logging
  await AuditLog.create({
    actor: currentUser.userId,
    actorRole: currentUser.role,
    action: `PAYMENT_${payload.status}`,
    entity: 'Payment',
    entityId: payment._id.toString(),
    details: {
      receiptNo: payment.receiptNo,
      previousStatus: prevStatus,
      newStatus: payload.status,
      rejectionReason: payment.rejectionReason,
    },
  });

  // Notify Guardian
  const guardian = payment.guardianId as any;
  if (guardian && guardian.userId) {
    const student = payment.studentId as any;
    const isVerified = payload.status === PaymentStatus.VERIFIED;
    await Notification.create({
      recipient: guardian.userId,
      title: isVerified ? 'Payment Verified ✅' : 'Payment Status Updated ⚠️',
      message: isVerified
        ? `Your payment of ৳${payment.amount} for ${student?.name || 'student'} (${payment.month} ${payment.year}) has been verified. Receipt: ${payment.receiptNo}`
        : `Your payment of ৳${payment.amount} for ${student?.name || 'student'} was ${payload.status.toLowerCase()}. ${payment.rejectionReason || ''}`,
      type: isVerified ? NotificationType.PAYMENT_VERIFIED : NotificationType.PAYMENT_REJECTED,
      link: `/payments/${payment._id}`,
      metadata: { paymentId: payment._id, receiptNo: payment.receiptNo },
    });
  }

  return payment;
};

export const getAllPaymentsService = async (query: {
  status?: string;
  semesterId?: string;
  studentId?: string;
  guardianId?: string;
  month?: string;
  year?: string;
  paymentMethod?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}) => {
  const {
    status,
    semesterId,
    studentId,
    guardianId,
    month,
    year,
    paymentMethod,
    search,
    startDate,
    endDate,
    page = 1,
    limit = 10,
  } = query;

  const filter: any = {};

  if (status) filter.status = status;
  if (semesterId) filter.semesterId = semesterId;
  if (studentId) filter.studentId = studentId;
  if (guardianId) filter.guardianId = guardianId;
  if (month) filter.month = month;
  if (year) filter.year = Number(year);
  if (paymentMethod) filter.paymentMethod = paymentMethod;

  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  if (search) {
    filter.$or = [
      { receiptNo: { $regex: search, $options: 'i' } },
      { transactionId: { $regex: search, $options: 'i' } },
      { senderPhone: { $regex: search, $options: 'i' } },
      { offlineReceiptNo: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Payment.countDocuments(filter);
  const payments = await Payment.find(filter)
    .populate('studentId', 'name admissionId classProgram rollNumber')
    .populate('guardianId', 'name phone email relation')
    .populate('semesterId', 'name academicYear')
    .populate('verifiedBy', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  return {
    payments,
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

export const getPaymentByIdService = async (id: string) => {
  const payment = await Payment.findById(id)
    .populate('studentId')
    .populate('guardianId')
    .populate('semesterId')
    .populate('verifiedBy', 'name email role')
    .populate('submittedBy', 'name email role');

  if (!payment) {
    throw new ApiError(404, 'Payment record not found');
  }

  return payment;
};

export const getGuardianPaymentsService = async (
  userId: string,
  query: { studentId?: string; status?: string; page?: number; limit?: number }
) => {
  const guardian = await Guardian.findOne({ userId });
  if (!guardian) {
    throw new ApiError(404, 'Guardian profile not found');
  }

  return getAllPaymentsService({
    ...query,
    guardianId: guardian._id.toString(),
  });
};
