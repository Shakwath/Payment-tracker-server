import type { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/apiResponse';
import {
  createFeeConfigService,
  getAllFeeConfigsService,
  getFeeForStudentService,
  getFeeConfigByIdService,
  updateFeeConfigService,
  deleteFeeConfigService,
} from './fee.service';

export const createFeeConfig = catchAsync(async (req: Request, res: Response) => {
  const result = await createFeeConfigService(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Fee configuration created successfully',
    data: result,
  });
});

export const getAllFeeConfigs = catchAsync(async (req: Request, res: Response) => {
  const result = await getAllFeeConfigsService(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Fee configurations retrieved successfully',
    data: result,
  });
});

export const getFeeForStudent = catchAsync(async (req: Request, res: Response) => {
  const { studentId, semesterId } = req.params;
  const result = await getFeeForStudentService(studentId as string, semesterId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Fee details for student retrieved successfully',
    data: result,
  });
});

export const getFeeConfigById = catchAsync(async (req: Request, res: Response) => {
  const result = await getFeeConfigByIdService(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Fee configuration retrieved successfully',
    data: result,
  });
});

export const updateFeeConfig = catchAsync(async (req: Request, res: Response) => {
  const result = await updateFeeConfigService(req.params.id as string, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Fee configuration updated successfully',
    data: result,
  });
});

export const deleteFeeConfig = catchAsync(async (req: Request, res: Response) => {
  const result = await deleteFeeConfigService(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Fee configuration deleted successfully',
    data: result,
  });
});
