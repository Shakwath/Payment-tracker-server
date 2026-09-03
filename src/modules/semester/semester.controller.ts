import type { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/apiResponse';
import {
  createSemesterService,
  getAllSemestersService,
  getCurrentSemesterService,
  getSemesterByIdService,
  updateSemesterService,
} from './semester.service';

export const createSemester = catchAsync(async (req: Request, res: Response) => {
  const result = await createSemesterService(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Semester created successfully',
    data: result,
  });
});

export const getAllSemesters = catchAsync(async (req: Request, res: Response) => {
  const result = await getAllSemestersService(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Semesters retrieved successfully',
    data: result,
  });
});

export const getCurrentSemester = catchAsync(async (_req: Request, res: Response) => {
  const result = await getCurrentSemesterService();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Current active semester retrieved successfully',
    data: result,
  });
});

export const getSemesterById = catchAsync(async (req: Request, res: Response) => {
  const result = await getSemesterByIdService(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Semester retrieved successfully',
    data: result,
  });
});

export const updateSemester = catchAsync(async (req: Request, res: Response) => {
  const result = await updateSemesterService(req.params.id as string, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Semester updated successfully',
    data: result,
  });
});
