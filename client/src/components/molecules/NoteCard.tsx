'use client';

import React, { useState } from 'react';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import Textarea from '../atoms/Textarea';
import ShareNoteModal from './ShareNoteModal';
import Modal from '../atoms/Modal';

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
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [iconPickerOpen, setIconPickerOpen] = useState(false);

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
      <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
        <h3 className="font-semibold text-lg mb-2">Edit Note</h3>
        {editedImageUrl && (
          <img
            src={`http://localhost:4000${editedImageUrl}`}
            alt="Note"
            key={editedImageUrl} // force re-render on URL change
            className="mb-2 rounded-lg max-h-40 w-auto mx-auto"
          />
        )}
        <input
          id={`edit-image-input-${note._id}`}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              const formData = new FormData();
              formData.append('image', file);
              const token = localStorage.getItem('token');
              const res = await fetch('http://localhost:4000/api/notes/upload-image', {
                method: 'POST',
                headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
                body: formData,
              });
              const data = await res.json();
              setEditedImageUrl(data.url);
            }
          }}
        />
        <Input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          className="mb-2 w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900"
        />
        <div className="relative mb-2">
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            rows={4}
            className="w-full pr-10 modal-content-textarea border border-gray-300 dark:border-gray-700 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900"
          />
          <button
            type="button"
            className="absolute right-2 top-2 text-2xl p-1 bg-gray-100 dark:bg-gray-800 rounded hover:bg-blue-100 dark:hover:bg-blue-900"
            onClick={() => setIconPickerOpen((open) => !open)}
            aria-label="Pick icon"
          >
            {editedIcon || "😊"}
          </button>
          {iconPickerOpen && (
            <div className="absolute right-0 top-10 z-10 flex flex-wrap gap-2 bg-white dark:bg-gray-800 p-2 rounded shadow border border-gray-200 dark:border-gray-700">
              {["😊", "⭐", "🔥", "💡", "📷", "📚", "✅", "❗", "🎉", "📝", "😂", "👍", "🙏", "🥳", "😎", "🤔", "😃", "😢", "😡", "❤️", "🚀"].map((ic) => (
                <button type="button" key={ic} className="text-2xl p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded" onClick={() => {
                  setEditedIcon(ic);
                  setIconPickerOpen(false);
                  // Insert icon at cursor position in content
                  const textarea = document.querySelector('.modal-content-textarea') as HTMLTextAreaElement;
                  if (textarea) {
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const before = editedContent.slice(0, start);
                    const after = editedContent.slice(end);
                    const updatedContent = before + ic + after;
                    setEditedContent(updatedContent);
                    setTimeout(() => {
                      textarea.focus();
                      textarea.selectionStart = textarea.selectionEnd = start + ic.length;
                    }, 0);
                  }
                }}>{ic}</button>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 mt-4">
          <Button onClick={handleSave} className="mr-1">
            Save
          </Button>
          <Button onClick={() => setEditModalOpen(false)}>
            Cancel
          </Button>
          <button
            type="button"
            className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-2xl px-3 py-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900"
            onClick={() => document.getElementById(`edit-image-input-${note._id}`)?.click()}
            aria-label="Select Image"
          >
            <span role="img" aria-label="camera">📷</span>
          </button>
        </div>
      </Modal>
      {isEditing ? null : (
        <>
          <div className="flex items-center gap-2 mb-2">
            {note.icon && <span className="text-2xl">{note.icon}</span>}
            <h3 className="font-semibold text-lg">{note.title}</h3>
          </div>
          {note.imageUrl && (
            <img src={`http://localhost:4000${note.imageUrl}`} alt="Note" className="mb-2 rounded-lg max-h-40 w-auto" />
          )}
          <p className="mb-2">{note.content}</p>
          <Button onClick={() => setEditModalOpen(true)} className="bg-yellow-400 text-black mr-2">
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
