'use client';

import React from 'react';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

const Label: React.FC<LabelProps> = ({ children, style, ...props }) => {
  return (
    <label style={{ display: 'block', marginBottom: '5px', ...style }} {...props}>
      {children}
    </label>
  );
};

export default Label;
