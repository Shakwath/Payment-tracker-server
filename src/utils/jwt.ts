import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

export interface TokenPayload {
  userId: string;
  role: string;
  email?: string;
  phone?: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, env.JWT.ACCESS_SECRET, {
    expiresIn: env.JWT.ACCESS_EXPIRES_IN as SignOptions['expiresIn'],
  });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, env.JWT.REFRESH_SECRET, {
    expiresIn: env.JWT.REFRESH_EXPIRES_IN as SignOptions['expiresIn'],
  });
};

export const verifyAccessToken = (token: string): TokenPayload & JwtPayload => {
  return jwt.verify(token, env.JWT.ACCESS_SECRET) as TokenPayload & JwtPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload & JwtPayload => {
  return jwt.verify(token, env.JWT.REFRESH_SECRET) as TokenPayload & JwtPayload;
};
