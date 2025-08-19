'use client';

import React from 'react';

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ ...props }) => {
  return (
    <input
      className="w-full p-2 rounded border border-border bg-card text-foreground focus:border-primary transition-colors"
      {...props}
    />
  );
};

export default Input;
