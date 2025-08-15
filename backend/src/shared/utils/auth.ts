import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const SALT_ROUNDS = 10;

function getEncryptionConfig() {
  const key = process.env.ENCRYPTION_KEY;
  const iv = process.env.ENCRYPTION_IV;

  if (!key || !iv) {
    throw new Error('Encryption configuration missing from environment variables');
  }
  if (key.length !== 32) {
    throw new Error('ENCRYPTION_KEY must be 32 characters long');
  }
  if (iv.length !== 16) {
    throw new Error('ENCRYPTION_IV must be 16 characters long');
  }

  return {
    key: Buffer.from(key),
    iv: Buffer.from(iv)
  };
}

export async function secureToken(token: string): Promise<string> {
  const { key, iv } = getEncryptionConfig();
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

export async function decryptToken(encryptedToken: string): Promise<string> {
  const { key, iv } = getEncryptionConfig();
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedToken, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

// Access token generator
export const generateAccessToken = (userId: number, role: string): string => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET!, { expiresIn: "15m" });
};

// Refresh token generator
export const generateRefreshToken = (userId: number, role: string): string => {
  return jwt.sign({ id: userId, role }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });
};

// Verify any token type
export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret);
};
