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
    <div className="mb-4">
      <Label htmlFor={id}>{label}:</Label>
      {isTextArea ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          required={required}
          rows={rows}
          className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
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
