'use client';

import React, { useState } from 'react';
import FormField from '../molecules/FormField';
import Button from '../atoms/Button';

interface NoteFormProps {
  onCreateNote: (title: string, content: string) => void;
}

const NoteForm: React.FC<NoteFormProps> = ({ onCreateNote }) => {
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateNote(newNoteTitle, newNoteContent);
    setNewNoteTitle('');
    setNewNoteContent('');
  };

  return (
    <div className="mb-5 border border-gray-300 p-4 rounded-lg bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
      <h2>Add New Note</h2>
      <form onSubmit={handleSubmit}>
        <FormField
          label="Title"
          id="newNoteTitle"
          value={newNoteTitle}
          onChange={(e) => setNewNoteTitle(e.target.value)}
          required
        />
        <FormField
          label="Content"
          id="newNoteContent"
          value={newNoteContent}
          onChange={(e) => setNewNoteContent(e.target.value)}
          isTextArea
          rows={4}
          required
        />
        <Button type="submit">
          Add Note
        </Button>
      </form>
    </div>
  );
};

export default NoteForm;
