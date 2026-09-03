import { Expense } from './expense.model';
import { AuditLog } from '../audit/audit.model';
import { ApiError } from '../../utils/apiError';
import type { IExpense } from './expense.interface';
import type { AuthUser } from '../../middlewares/auth.middleware';

export const createExpenseService = async (
  payload: IExpense,
  currentUser: AuthUser,
  attachmentUrl?: string
) => {
  const expenseData = {
    ...payload,
    attachmentUrl: attachmentUrl || payload.attachmentUrl || '',
    createdBy: currentUser.userId as any,
  };

  const expense = await Expense.create(expenseData);

  // Audit Logging
  await AuditLog.create({
    actor: currentUser.userId,
    actorRole: currentUser.role,
    action: 'CREATE_EXPENSE',
    entity: 'Expense',
    entityId: expense._id.toString(),
    details: {
      title: expense.title,
      category: expense.category,
      amount: expense.amount,
      month: expense.month,
      year: expense.year,
    },
  });

  return expense;
};

export const getAllExpensesService = async (query: {
  category?: string;
  month?: string;
  year?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const { category, month, year, startDate, endDate, search, page = 1, limit = 10 } = query;
  const filter: any = {};

  if (category) filter.category = category;
  if (month) filter.month = month;
  if (year) filter.year = Number(year);

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { voucherNo: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Expense.countDocuments(filter);

  // Calculate total expense amount matching filter
  const totalAmountAgg = await Expense.aggregate([
    { $match: filter },
    { $group: { _id: null, totalAmount: { $sum: '$amount' } } },
  ]);
  const totalAmount = totalAmountAgg[0]?.totalAmount || 0;

  const expenses = await Expense.find(filter)
    .populate('createdBy', 'name email')
    .sort({ date: -1 })
    .skip(skip)
    .limit(Number(limit));

  return {
    expenses,
    totalAmount,
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

export const getExpenseByIdService = async (id: string) => {
  const expense = await Expense.findById(id).populate('createdBy', 'name email');
  if (!expense) {
    throw new ApiError(404, 'Expense record not found');
  }
  return expense;
};

export const updateExpenseService = async (
  id: string,
  payload: Partial<IExpense>,
  currentUser: AuthUser,
  attachmentUrl?: string
) => {
  const expense = await Expense.findById(id);
  if (!expense) {
    throw new ApiError(404, 'Expense record not found');
  }

  const updateData = {
    ...payload,
    ...(attachmentUrl ? { attachmentUrl } : {}),
  };

  const updatedExpense = await Expense.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  // Audit Log
  await AuditLog.create({
    actor: currentUser.userId,
    actorRole: currentUser.role,
    action: 'UPDATE_EXPENSE',
    entity: 'Expense',
    entityId: id,
    details: {
      before: { title: expense.title, amount: expense.amount, category: expense.category },
      after: { title: updatedExpense?.title, amount: updatedExpense?.amount, category: updatedExpense?.category },
    },
  });

  return updatedExpense;
};

export const deleteExpenseService = async (id: string, currentUser: AuthUser) => {
  const expense = await Expense.findByIdAndDelete(id);
  if (!expense) {
    throw new ApiError(404, 'Expense record not found');
  }

  // Audit Log
  await AuditLog.create({
    actor: currentUser.userId,
    actorRole: currentUser.role,
    action: 'DELETE_EXPENSE',
    entity: 'Expense',
    entityId: id,
    details: {
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      month: expense.month,
      year: expense.year,
    },
  });

  return expense;
};
