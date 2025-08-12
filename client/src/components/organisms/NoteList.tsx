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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {notes.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground bg-card rounded-lg border border-border">
          No notes yet. Add one above!
        </div>
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
