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
    <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      {isEditing ? (
        <>
          <Input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            style={{ marginBottom: '10px' }}
          />
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            rows={4}
            style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
          ></textarea>
          <Button onClick={handleSave} style={{ backgroundColor: '#28a745', marginRight: '5px' }}>
            Save
          </Button>
          <Button onClick={onCancelEdit} style={{ backgroundColor: '#6c757d' }}>
            Cancel
          </Button>
        </>
      ) : (
        <>
          <h3>{note.title}</h3>
          <p>{note.content}</p>
          <Button onClick={() => onEdit(note)} style={{ backgroundColor: '#ffc107', color: 'black', marginRight: '5px' }}>
            Edit
          </Button>
          <Button onClick={() => onDelete(note._id)} style={{ backgroundColor: '#dc3545' }}>
            Delete
          </Button>
        </>
      )}
    </div>
  );
};

export default NoteCard;
