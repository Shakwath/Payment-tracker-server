import { User } from '../user/user.model';
import { ApiError } from '../../utils/apiError';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { UserStatus, type UserRole } from '../../constants';

export const loginUserService = async (payload: { identifier: string; password: string }) => {
  const { identifier, password } = payload;

  const user = await User.isUserExistsByEmailOrPhone(identifier);
  if (!user) {
    throw new ApiError(401, 'Invalid credentials. User not found.');
  }

  if (user.status === UserStatus.INACTIVE) {
    throw new ApiError(403, 'Your account has been deactivated. Please contact the administrator.');
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    throw new ApiError(401, 'Invalid credentials. Password incorrect.');
  }

  const tokenPayload = {
    userId: user._id.toString(),
    role: user.role,
    email: user.email,
    phone: user.phone,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  // Update last login and refresh token
  user.lastLogin = new Date();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // Get user details without sensitive fields
  const userProfile = await User.findById(user._id).populate('guardianId').populate('teacherId');

  return {
    accessToken,
    refreshToken,
    user: userProfile,
  };
};

export const refreshTokenService = async (token: string) => {
  const decoded = verifyRefreshToken(token);

  const user = await User.findById(decoded.userId).select('+refreshToken');
  if (!user) {
    throw new ApiError(401, 'User not found');
  }

  if (user.status === UserStatus.INACTIVE) {
    throw new ApiError(403, 'Your account is deactivated.');
  }

  if (user.refreshToken !== token) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  const tokenPayload = {
    userId: user._id.toString(),
    role: user.role,
    email: user.email,
    phone: user.phone,
  };

  const accessToken = generateAccessToken(tokenPayload);

  return {
    accessToken,
  };
};

export const changePasswordService = async (
  userId: string,
  payload: { oldPassword: string; newPassword: string }
) => {
  const { oldPassword, newPassword } = payload;

  const user = await User.findById(userId).select('+password');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isMatched = await user.comparePassword(oldPassword);
  if (!isMatched) {
    throw new ApiError(400, 'Incorrect current password');
  }

  user.password = newPassword;
  user.isPasswordResetRequired = false;
  await user.save();

  return { message: 'Password updated successfully' };
};

export const getMeService = async (userId: string) => {
  const user = await User.findById(userId).populate('guardianId').populate('teacherId');
  if (!user) {
    throw new ApiError(404, 'User profile not found');
  }
  return user;
};
