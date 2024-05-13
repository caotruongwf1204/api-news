import { User } from "@/database/entities/User";
import jwt from 'jsonwebtoken';

// Tạo Refresh Token
export function generateRefreshToken(user: User) {
    return jwt.sign({ userId: user.id }, 'refreshSecret', { expiresIn: '7d' });
  }