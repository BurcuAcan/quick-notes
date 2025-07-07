'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import AuthForm from '../../../components/organisms/AuthForm';

export default function LoginPage() {
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (data: any) => {
    try {
      const response = await axios.post('http://localhost:4000/api/auth/login', {
        username: data.username,
        password: data.password,
      });
      localStorage.setItem('token', response.data.token);
      router.push('/'); // Redirect to home page after successful login
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <AuthForm type="login" onSubmit={handleLogin} error={error} />
  );
}