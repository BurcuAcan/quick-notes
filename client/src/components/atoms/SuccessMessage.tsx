'use client';

import React from 'react';

interface SuccessMessageProps {
  message: string;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ message }) => {
  return <p className="text-success mt-4">{message}</p>;
};

export default SuccessMessage;
