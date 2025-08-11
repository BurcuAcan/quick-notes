'use client';

import React from 'react';

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ ...props }) => {
  return (
    <input
      className="w-full p-2 rounded border border-gray-300"
      {...props}
    />
  );
};

export default Input;
