'use client';

import React from 'react';

interface SuccessMessageProps {
  message: string;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ message }) => {
  return <p style={{ color: 'green', marginTop: '15px' }}>{message}</p>;
};

export default SuccessMessage;
