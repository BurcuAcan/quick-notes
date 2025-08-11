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
  const [isShareModalOpen, setShareModalOpen] = useState(false);

  React.useEffect(() => {
    if (isEditing) {
      setEditedTitle(note.title);
      setEditedContent(note.content);
    }
  }, [isEditing, note.title, note.content]);

  const handleSave = () => {
    onSave(note._id, editedTitle, editedContent);
  };

  const handleShare = async (email: string) => {
    try {
      const token = localStorage.getItem('token'); // veya senin kullandığın şekilde
      // E-posta ile userId al
      const userRes = await fetch(`http://localhost:4000/api/users/by-email/${email}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('userRes', userRes);
      const user = await userRes.json();
      if (!user._id) throw new Error('Kullanıcı bulunamadı');
      // Notu paylaş
      await fetch(`http://localhost:4000/api/notes/${note._id}/share`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: user._id })
      });
      alert('Not başarıyla paylaşıldı!');
      setShareModalOpen(false);
    } catch (err) {
      alert('Paylaşım başarısız: ' + (err instanceof Error ? err.message : String(err)));
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
          <Button onClick={handleSave} className="mr-1">
            Save
          </Button>
          <Button onClick={onCancelEdit}>
            Cancel
          </Button>
        </>
      ) : (
        <>
          <h3 className="font-semibold text-lg mb-1">{note.title}</h3>
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
