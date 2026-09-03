import type { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/apiResponse';
import {
  createTeacherService,
  getAllTeachersService,
  getTeacherByIdService,
  getTeacherByUserIdService,
  updateTeacherService,
} from './teacher.service';

export const createTeacher = catchAsync(async (req: Request, res: Response) => {
  const result = await createTeacherService(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Teacher created successfully',
    data: result,
  });
});

export const getAllTeachers = catchAsync(async (req: Request, res: Response) => {
  const result = await getAllTeachersService(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Teachers retrieved successfully',
    data: result.teachers,
    meta: result.meta,
  });
});

export const getTeacherById = catchAsync(async (req: Request, res: Response) => {
  const result = await getTeacherByIdService(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Teacher retrieved successfully',
    data: result,
  });
});

export const getMyTeacherProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const result = await getTeacherByUserIdService(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Teacher profile retrieved successfully',
    data: result,
  });
});

export const updateTeacher = catchAsync(async (req: Request, res: Response) => {
  const result = await updateTeacherService(req.params.id as string, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Teacher updated successfully',
    data: result,
  });
});
