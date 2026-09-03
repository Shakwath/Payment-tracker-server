import type { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/apiResponse';
import {
  createStudentService,
  getAllStudentsService,
  getStudentByIdService,
  updateStudentService,
} from './student.service';

export const createStudent = catchAsync(async (req: Request, res: Response) => {
  const result = await createStudentService(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Student created successfully',
    data: result,
  });
});

export const getAllStudents = catchAsync(async (req: Request, res: Response) => {
  const result = await getAllStudentsService(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Students retrieved successfully',
    data: result.students,
    meta: result.meta,
  });
});

export const getStudentById = catchAsync(async (req: Request, res: Response) => {
  const result = await getStudentByIdService(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Student retrieved successfully',
    data: result,
  });
});

export const updateStudent = catchAsync(async (req: Request, res: Response) => {
  const result = await updateStudentService(req.params.id as string, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Student updated successfully',
    data: result,
  });
});
