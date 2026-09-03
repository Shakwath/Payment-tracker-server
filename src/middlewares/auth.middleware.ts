import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import { verifyAccessToken } from '../utils/jwt';
import { User } from '../modules/user/user.model';
import { UserRole, UserStatus } from '../constants';

export interface AuthUser {
  userId: string;
  role: UserRole;
  email?: string;
  phone?: string;
  guardianId?: string;
  teacherId?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Authentication token missing or invalid');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new ApiError(401, 'Authentication token not provided');
    }

    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new ApiError(401, 'User account not found');
    }

    if (user.status === UserStatus.INACTIVE) {
      throw new ApiError(403, 'Your account is deactivated. Please contact the administrator.');
    }

    req.user = {
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
      phone: user.phone,
      guardianId: user.guardianId?.toString(),
      teacherId: user.teacherId?.toString(),
    };

    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new ApiError(401, 'You are not authenticated'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `Access forbidden: Role '${req.user.role}' is not authorized to access this resource`
        )
      );
    }

    next();
  };
};
