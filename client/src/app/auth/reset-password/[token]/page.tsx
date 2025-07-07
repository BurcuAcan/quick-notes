'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import AuthForm from '../../../../components/organisms/AuthForm';

export default function ResetPasswordPage() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const params = useParams();
  const { token } = params;

  const handleSubmit = async (data: any) => {
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await axios.put(`http://localhost:4000/api/auth/reset-password/${token}`, {
        password: data.password,
      });
      setMessage('Password has been reset successfully!');
      setError('');
      router.push('/auth/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password');
      setMessage('');
    }
  };

  return (
    <AuthForm type="reset-password" onSubmit={handleSubmit} error={error} message={message} token={token as string} />
  );
}