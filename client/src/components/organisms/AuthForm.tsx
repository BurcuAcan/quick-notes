'use client';

import React, { useState } from 'react';
import FormField from '../molecules/FormField';
import Button from '../atoms/Button';
import ErrorMessage from '../atoms/ErrorMessage';
import SuccessMessage from '../atoms/SuccessMessage';
import Link from 'next/link';

interface AuthFormProps {
  type: 'login' | 'register' | 'forgot-password' | 'reset-password';
  onSubmit: (data: any) => void;
  error?: string;
  message?: string;
  token?: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit, error, message, token }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'reset-password' && password !== confirmPassword) {
      // This check is also in the page, but good to have here too
      return;
    }
    onSubmit({
      username,
      password,
      token,
    });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '400px', margin: '50px auto', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
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
        {(type === 'login' || type === 'register' || type === 'reset-password') && (
          <div style={{ position: 'relative', marginBottom: '15px' }}>
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
              style={{
                position: 'absolute',
                right: '10px',
                top: '35px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#007bff',
                fontSize: '0.8em',
              }}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        )}
        {type === 'reset-password' && (
          <div style={{ position: 'relative', marginBottom: '15px' }}>
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
              style={{
                position: 'absolute',
                right: '10px',
                top: '35px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#007bff',
                fontSize: '0.8em',
              }}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        )}
        {error && <ErrorMessage message={error} />}
        {message && <SuccessMessage message={message} />}
        <Button type="submit" style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {type === 'login' ? 'Login' : type === 'register' ? 'Register' : type === 'forgot-password' ? 'Request Reset' : 'Reset Password'}
        </Button>
      </form>
      {type === 'login' && (
        <p style={{ marginTop: '20px', textAlign: 'center' }}>
          Don't have an account? <Link href="/auth/register" style={{ color: '#007bff', textDecoration: 'none' }}>Register here</Link>
        </p>
      )}
      {type === 'login' && (
        <p style={{ marginTop: '10px', textAlign: 'center' }}>
          <Link href="/auth/forgot-password" style={{ color: '#007bff', textDecoration: 'none' }}>Forgot Password?</Link>
        </p>
      )}
      {type === 'register' && (
        <p style={{ marginTop: '20px', textAlign: 'center' }}>
          Already have an account? <Link href="/auth/login" style={{ color: '#007bff', textDecoration: 'none' }}>Login here</Link>
        </p>
      )}
      {type === 'forgot-password' && (
        <p style={{ marginTop: '20px', textAlign: 'center' }}>
          Remember your password? <Link href="/auth/login" style={{ color: '#007bff', textDecoration: 'none' }}>Login here</Link>
        </p>
      )}
    </div>
  );
};

export default AuthForm;