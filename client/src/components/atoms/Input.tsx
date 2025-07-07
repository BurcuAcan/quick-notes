'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // You can add custom props here if needed
}

const Input: React.FC<InputProps> = ({ style, ...props }) => {
  return (
    <input
      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', ...style }}
      {...props}
    />
  );
};

export default Input;
