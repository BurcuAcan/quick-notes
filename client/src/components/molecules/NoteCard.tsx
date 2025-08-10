'use client';

import React, { useState } from 'react';
import Button from '../atoms/Button';
import Input from '../atoms/Input';

interface Note {
  _id: string;
  title: string;
  content: string;
}

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onSave: (id: string, title: string, content: string) => void;
  onCancelEdit: () => void;
  isEditing: boolean;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete, onSave, onCancelEdit, isEditing }) => {
  const [editedTitle, setEditedTitle] = useState(note.title);
  const [editedContent, setEditedContent] = useState(note.content);

  React.useEffect(() => {
    if (isEditing) {
      setEditedTitle(note.title);
      setEditedContent(note.content);
    }
  }, [isEditing, note.title, note.content]);

  const handleSave = () => {
    onSave(note._id, editedTitle, editedContent);
  };

  return (
    <div className="border border-gray-200 p-4 rounded-lg shadow-md bg-white text-gray-900 dark:border-gray-700 dark:shadow-lg dark:bg-gray-800 dark:text-gray-100">
      {isEditing ? (
        <>
          <Input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="mb-2"
          />
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            rows={4}
            className="w-full p-2 mb-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          ></textarea>
          <Button onClick={handleSave} className="bg-green-600 mr-1 dark:bg-green-700 dark:text-gray-100">
            Save
          </Button>
          <Button onClick={onCancelEdit} className="bg-gray-500 dark:bg-gray-600 dark:text-gray-100">
            Cancel
          </Button>
        </>
      ) : (
        <>
          <h3>{note.title}</h3>
          <p>{note.content}</p>
          <Button onClick={() => onEdit(note)} className="bg-yellow-500 text-black mr-1 dark:bg-yellow-600 dark:text-gray-100">
            Edit
          </Button>
          <Button onClick={() => onDelete(note._id)} className="bg-red-600 dark:bg-red-700 dark:text-gray-100">
            Delete
          </Button>
        </>
      )}
    </div>
  );
};

export default NoteCard;
