import type { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/apiResponse';
import {
  loginUserService,
  refreshTokenService,
  changePasswordService,
  getMeService,
} from './auth.service';

export const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await loginUserService(req.body);

  // Set refresh token in HTTP-only secure cookie
  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully',
    data: result,
  });
});

export const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const token = req.body.refreshToken || req.cookies?.refreshToken;
  const result = await refreshTokenService(token);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Access token refreshed successfully',
    data: result,
  });
});

export const changePassword = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const result = await changePasswordService(userId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
    data: null,
  });
});

export const getMe = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const result = await getMeService(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Profile retrieved successfully',
    data: result,
  });
});
