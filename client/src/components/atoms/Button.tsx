'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, className = '', ...props }) => {
  return (
    <button
      className={`px-4 py-2 rounded cursor-pointer bg-primary text-foreground hover:bg-secondary transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
