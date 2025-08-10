'use client';

import React from 'react';
import NoteCard from '../molecules/NoteCard';

interface Note {
  _id: string;
  title: string;
  content: string;
}

interface NoteListProps {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onSave: (id: string, title: string, content: string) => void;
  onCancelEdit: () => void;
  editingNoteId: string | null;
}

const NoteList: React.FC<NoteListProps> = ({ notes, onEdit, onDelete, onSave, onCancelEdit, editingNoteId }) => {
  return (
    <div className="grid grid-cols-auto-fill-minmax-250px gap-5">
      {notes.length === 0 ? (
        <p>No notes yet. Add one above!</p>
      ) : (
        notes.map((note) => (
          <NoteCard
            key={note._id}
            note={note}
            onEdit={onEdit}
            onDelete={onDelete}
            onSave={onSave}
            onCancelEdit={onCancelEdit}
            isEditing={editingNoteId === note._id}
          />
        ))
      )}
    </div>
  );
};

export default NoteList;
