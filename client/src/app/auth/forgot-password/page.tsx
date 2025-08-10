'use client';

import { useState } from 'react';
import axios from 'axios';
import AuthForm from '../../../components/organisms/AuthForm';

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (data: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    try {
      const response = await axios.post('http://localhost:4000/api/auth/forgot-password', {
        username: data.username,
      });
      setMessage(response.data.message);
      setError('');
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      setError(err.response?.data?.message || 'Failed to send reset request');
      setMessage('');
    }
  };

  return (
    <AuthForm type="forgot-password" onSubmit={handleSubmit} error={error} message={message} />
  );
}