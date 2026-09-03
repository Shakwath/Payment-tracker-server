import type { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/apiResponse';
import {
  createGuardianService,
  getAllGuardiansService,
  getGuardianByIdService,
  getGuardianByUserIdService,
  updateGuardianService,
} from './guardian.service';

export const createGuardian = catchAsync(async (req: Request, res: Response) => {
  const result = await createGuardianService(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Guardian created successfully',
    data: result,
  });
});

export const getAllGuardians = catchAsync(async (req: Request, res: Response) => {
  const result = await getAllGuardiansService(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Guardians retrieved successfully',
    data: result.guardians,
    meta: result.meta,
  });
});

export const getGuardianById = catchAsync(async (req: Request, res: Response) => {
  const result = await getGuardianByIdService(req.params.id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Guardian retrieved successfully',
    data: result,
  });
});

export const getMyGuardianProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const result = await getGuardianByUserIdService(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Guardian profile retrieved successfully',
    data: result,
  });
});

export const updateGuardian = catchAsync(async (req: Request, res: Response) => {
  const result = await updateGuardianService(req.params.id as string, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Guardian updated successfully',
    data: result,
  });
});
