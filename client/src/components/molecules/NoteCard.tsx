'use client';

import React, { useState } from 'react';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import Textarea from '../atoms/Textarea';
import ShareNoteModal from './ShareNoteModal';

interface Note {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  icon?: string;
}

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onSave: (id: string, title: string, content: string, imageUrl?: string, icon?: string) => void;
  onCancelEdit: () => void;
  isEditing: boolean;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete, onSave, onCancelEdit, isEditing }) => {
  const [editedTitle, setEditedTitle] = useState(note.title);
  const [editedContent, setEditedContent] = useState(note.content);
  const [editedImageUrl, setEditedImageUrl] = useState(note.imageUrl || '');
  const [editedIcon, setEditedIcon] = useState(note.icon || '');
  const [isShareModalOpen, setShareModalOpen] = useState(false);

  React.useEffect(() => {
    if (isEditing) {
      setEditedTitle(note.title);
      setEditedContent(note.content);
      setEditedImageUrl(note.imageUrl || '');
      setEditedIcon(note.icon || '');
    }
  }, [isEditing, note.title, note.content, note.imageUrl, note.icon]);

  const handleSave = () => {
    onSave(note._id, editedTitle, editedContent, editedImageUrl, editedIcon);
  };

  const handleShare = async (email: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:4000/api/notes/${note._id}/share-request`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ recipientEmail: email })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Share request failed');
      }
      alert('Share request sent!');
      setShareModalOpen(false);
    } catch (err) {
      alert('Share request failed: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  return (
    <div className="border border-gray-200 p-4 rounded-lg shadow-md">
      <ShareNoteModal
        isOpen={isShareModalOpen}
        onClose={() => setShareModalOpen(false)}
        onShare={handleShare}
      />
      {isEditing ? (
        <>
          <Input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="mb-2"
          />
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            rows={4}
            className="w-full mb-2"
          />
          <Input
            type="text"
            value={editedImageUrl}
            onChange={(e) => setEditedImageUrl(e.target.value)}
            placeholder="Image URL"
            className="mb-2"
          />
          <Input
            type="text"
            value={editedIcon}
            onChange={(e) => setEditedIcon(e.target.value)}
            placeholder="Icon (emoji or name)"
            className="mb-2"
          />
          <Button onClick={handleSave} className="mr-1">
            Save
          </Button>
          <Button onClick={onCancelEdit}>
            Cancel
          </Button>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-2">
            {note.icon && <span className="text-2xl">{note.icon}</span>}
            <h3 className="font-semibold text-lg">{note.title}</h3>
          </div>
          {note.imageUrl && (
            <img src={note.imageUrl} alt="Note" className="mb-2 rounded-lg max-h-40 w-auto" />
          )}
          <p className="mb-2">{note.content}</p>
          <Button onClick={() => onEdit(note)} className="bg-yellow-400 text-black mr-2">
            Edit
          </Button>
          <Button onClick={() => onDelete(note._id)} className="bg-red-600 text-white mr-2">
            Delete
          </Button>
          <Button onClick={() => setShareModalOpen(true)}>
            Share
          </Button>
        </>
      )}
    </div>
  );
};

export default NoteCard;
