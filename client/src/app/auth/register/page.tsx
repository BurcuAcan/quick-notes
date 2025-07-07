'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import AuthForm from '../../../components/organisms/AuthForm';

export default function RegisterPage() {
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (data: any) => {
    try {
      await axios.post('http://localhost:4000/api/auth/register', {
        username: data.username,
        password: data.password,
      });
      router.push('/auth/login'); // Redirect to login page after successful registration
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <AuthForm type="register" onSubmit={handleRegister} error={error} />
  );
}