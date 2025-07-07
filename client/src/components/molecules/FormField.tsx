'use client';

import React from 'react';
import Input from '../atoms/Input';
import Label from '../atoms/Label';

interface FormFieldProps {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  isTextArea?: boolean;
  rows?: number;
}

const FormField: React.FC<FormFieldProps> = ({ label, id, type = 'text', value, onChange, required = false, isTextArea = false, rows = 4 }) => {
  return (
    <div style={{ marginBottom: '15px' }}>
      <Label htmlFor={id}>{label}:</Label>
      {isTextArea ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          required={required}
          rows={rows}
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
        ></textarea>
      ) : (
        <Input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          required={required}
        />
      )}
    </div>
  );
};

export default FormField;
