import type { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/apiResponse';
import {
  createResultService,
  getAllResultsService,
  getResultsForStudentService,
  updateResultService,
  deleteResultService,
} from './result.service';

export const createResult = catchAsync(async (req: Request, res: Response) => {
  const currentUser = req.user!;
  const result = await createResultService(req.body, currentUser);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Student result recorded successfully',
    data: result,
  });
});

export const getAllResults = catchAsync(async (req: Request, res: Response) => {
  const result = await getAllResultsService(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Results retrieved successfully',
    data: result,
  });
});

export const getStudentResults = catchAsync(async (req: Request, res: Response) => {
  const { studentId } = req.params;
  const semesterId = req.query.semesterId as string | undefined;
  const result = await getResultsForStudentService(studentId as string, semesterId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Student results retrieved successfully',
    data: result,
  });
});

export const updateResult = catchAsync(async (req: Request, res: Response) => {
  const result = await updateResultService(req.params.id as string, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Result updated successfully',
    data: result,
  });
});

export const deleteResult = catchAsync(async (req: Request, res: Response) => {
  const result = await deleteResultService(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Result deleted successfully',
    data: result,
  });
});
