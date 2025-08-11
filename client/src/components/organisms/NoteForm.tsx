'use client';

import React, { useState } from 'react';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import Textarea from '../atoms/Textarea';

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
    <div className="mb-5 border border-gray-200 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Add New Note</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="newNoteTitle" className="block mb-1 font-medium">
            Title:
          </label>
          <Input
            id="newNoteTitle"
            value={newNoteTitle}
            onChange={(e) => setNewNoteTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="newNoteContent" className="block mb-1 font-medium">
            Content:
          </label>
          <Textarea
            id="newNoteContent"
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            rows={4}
            required
          />
        </div>
        <Button type="submit" >
          Add Note
        </Button>
      </form>
    </div>
  );
};

export default NoteForm;
