import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import { upload } from '../../config/multer';
import { UserRole } from '../../constants';
import {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} from './expense.controller';
import {
  createExpenseValidationSchema,
  updateExpenseValidationSchema,
} from './expense.validation';

const router = Router();

router.use(authenticate);
router.use(authorize(UserRole.ADMIN));

router.route('/')
  .post(upload.single('attachment'), validateRequest(createExpenseValidationSchema), createExpense)
  .get(getAllExpenses);

router.route('/:id')
  .get(getExpenseById)
  .patch(upload.single('attachment'), validateRequest(updateExpenseValidationSchema), updateExpense)
  .delete(deleteExpense);

export const expenseRoutes = router;
