'use client';

import React, { useState } from 'react';
import FormField from '../molecules/FormField';
import Button from '../atoms/Button';
import ErrorMessage from '../atoms/ErrorMessage';
import SuccessMessage from '../atoms/SuccessMessage';
import Link from 'next/link';

interface AuthFormProps {
  type: 'login' | 'register' | 'forgot-password' | 'reset-password';
  onSubmit: (data: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  error?: string;
  message?: string;
  token?: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit, error, message, token }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'reset-password' && password !== confirmPassword) {
      // This check is also in the page, but good to have here too
      return;
    }
    if (type === 'register') {
      onSubmit({ username, email, password });
    } else {
      onSubmit({
        username,
        password,
        token,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-8 text-center tracking-tight drop-shadow-sm dark:text-blue-400">
          {type === 'login' ? 'Login' : type === 'register' ? 'Register' : type === 'forgot-password' ? 'Forgot Password' : 'Reset Password'}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          {(type === 'login' || type === 'register' || type === 'forgot-password') && (
            <FormField
              label="Username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}
          {type === 'register' && (
            <FormField
              label="Email"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          )}
          {(type === 'login' || type === 'register' || type === 'reset-password') && (
            <div className="relative">
              <FormField
                label={type === 'reset-password' ? 'New Password' : 'Password'}
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-9 bg-transparent border-none cursor-pointer text-blue-500 text-sm hover:underline dark:text-blue-300"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          )}
          {type === 'reset-password' && (
            <div className="relative">
              <FormField
                label="Confirm New Password"
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-9 bg-transparent border-none cursor-pointer text-blue-500 text-sm hover:underline dark:text-blue-300"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          )}
          {error && <ErrorMessage message={error} />}
          {message && <SuccessMessage message={message} />}
          <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 transition-colors font-semibold text-lg py-2 rounded-xl shadow dark:bg-blue-700 dark:hover:bg-blue-800">
            {type === 'login' ? 'Login' : type === 'register' ? 'Register' : type === 'forgot-password' ? 'Request Reset' : 'Reset Password'}
          </Button>
        </form>
        {type === 'login' && (
          <p className="mt-8 text-center text-gray-600 dark:text-gray-300">
            Don&apos;t have an account? <Link href="/auth/register" className="text-blue-500 hover:underline dark:text-blue-300">Register here</Link>
          </p>
        )}
        {type === 'login' && (
          <p className="mt-2 text-center text-gray-600 dark:text-gray-300">
            <Link href="/auth/forgot-password" className="text-blue-500 hover:underline dark:text-blue-300">Forgot Password?</Link>
          </p>
        )}
        {type === 'register' && (
          <p className="mt-8 text-center text-gray-600 dark:text-gray-300">
            Already have an account? <Link href="/auth/login" className="text-blue-500 hover:underline dark:text-blue-300">Login here</Link>
          </p>
        )}
        {type === 'forgot-password' && (
          <p className="mt-8 text-center text-gray-600 dark:text-gray-300">
            Remember your password? <Link href="/auth/login" className="text-blue-500 hover:underline dark:text-blue-300">Login here</Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthForm;