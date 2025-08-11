'use client';

import React from 'react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return <p className="text-red-500 mb-4">{message}</p>;
};

export default ErrorMessage;
