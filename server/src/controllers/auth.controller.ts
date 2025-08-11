import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import jwt from 'jsonwebtoken';
import { Document } from 'mongoose';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretjwtkey', { expiresIn: '1h' });
};

export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ $or: [{ username }, { email }] });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      username,
      email,
      password,
    }) as IUser & Document;

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(String(user._id)),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username }) as (IUser & Document) | null;

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        token: generateToken(String(user._id)),
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { username } = req.body;

  try {
    const user = await User.findOne({ username }) as (IUser & Document) | null;

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save();

    const resetURL = `${process.env.FRONTEND_URL}/auth/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetURL}`;

    try {
      await sendEmail({
        to: user.username, // Assuming username is email for simplicity
        subject: 'Password Reset Token',
        text: message,
        html: `<p>${message}</p>`,
      });

      res.status(200).json({
        message: 'Email sent',
      });
    } catch (error: any) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      res.status(500).json({ message: 'Email could not be sent' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { password } = req.body;

  const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    }) as (IUser & Document) | null;

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};