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
    <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
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
        <Button type="submit" style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Add Note
        </Button>
      </form>
    </div>
  );
};

export default NoteForm;
