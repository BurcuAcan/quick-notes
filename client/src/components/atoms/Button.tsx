'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button
      className="px-4 py-2 bg-blue-500 text-white border-none rounded cursor-pointer dark:bg-blue-700 dark:text-gray-100"
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
