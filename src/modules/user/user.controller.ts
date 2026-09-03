import type { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/apiResponse';
import {
  createUserService,
  getAllUsersService,
  getUserByIdService,
  updateUserService,
  adminResetPasswordService,
} from './user.service';

export const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await createUserService(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User created successfully',
    data: result,
  });
});

export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await getAllUsersService(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Users retrieved successfully',
    data: result.users,
    meta: result.meta,
  });
});

export const getUserById = catchAsync(async (req: Request, res: Response) => {
  const result = await getUserByIdService(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User retrieved successfully',
    data: result,
  });
});

export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const result = await updateUserService(req.params.id as string, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User updated successfully',
    data: result,
  });
});

export const adminResetPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await adminResetPasswordService(req.params.id as string, req.body.newPassword);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
    data: null,
  });
});
