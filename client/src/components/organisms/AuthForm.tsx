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
    <div className="p-5 font-sans max-w-md mx-auto mt-12 border border-gray-300 rounded-lg shadow-md">
      <h1>{type === 'login' ? 'Login' : type === 'register' ? 'Register' : type === 'forgot-password' ? 'Forgot Password' : 'Reset Password'}</h1>
      <form onSubmit={handleSubmit}>
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
          <div className="relative mb-4">
            <FormField
              label={type === 'reset-password' ? 'New Password' : 'Password'}
              id="password"
              type={showPassword ? 'text' : 'password'} // Dynamic type
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-9 bg-transparent border-none cursor-pointer text-blue-500 text-sm"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        )}
        {type === 'reset-password' && (
          <div className="relative mb-4">
            <FormField
              label="Confirm New Password"
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'} // Dynamic type
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-9 bg-transparent border-none cursor-pointer text-blue-500 text-sm"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        )}
        {error && <ErrorMessage message={error} />}
        {message && <SuccessMessage message={message} />}
        <Button type="submit">
          {type === 'login' ? 'Login' : type === 'register' ? 'Register' : type === 'forgot-password' ? 'Request Reset' : 'Reset Password'}
        </Button>
      </form>
      {type === 'login' && (
        <p className="mt-5 text-center">
          Don&apos;t have an account? <Link href="/auth/register" className="text-blue-500 no-underline">Register here</Link>
        </p>
      )}
      {type === 'login' && (
        <p className="mt-2 text-center">
          <Link href="/auth/forgot-password" className="text-blue-500 no-underline">Forgot Password?</Link>
        </p>
      )}
      {type === 'register' && (
        <p className="mt-5 text-center">
          Already have an account? <Link href="/auth/login" className="text-blue-500 no-underline">Login here</Link>
        </p>
      )}
      {type === 'forgot-password' && (
        <p className="mt-5 text-center">
          Remember your password? <Link href="/auth/login" className="text-blue-500 no-underline">Login here</Link>
        </p>
      )}
    </div>
  );
};

export default AuthForm;