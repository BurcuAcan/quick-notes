'use client';

import React, { useState } from 'react';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import Textarea from '../atoms/Textarea';

interface NoteFormProps {
  onCreateNote: (title: string, content: string, imageUrl?: string, icon?: string) => void;
}

const NoteForm: React.FC<NoteFormProps> = ({ onCreateNote }) => {
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [icon, setIcon] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageUrl = '';
    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:4000/api/notes/upload-image', {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
        body: formData,
      });
      const data = await res.json();
      imageUrl = data.url;
    }
    onCreateNote(newNoteTitle, newNoteContent, imageUrl, icon);
    setNewNoteTitle('');
    setNewNoteContent('');
    setImageFile(null);
    setIcon('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview('');
    }
  };

  const handleIconSelect = (selectedIcon: string) => {
    setIcon(selectedIcon);
    setIconPickerOpen(false);
    // Insert icon at cursor position in content
    const textarea = document.getElementById('newNoteContent') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const before = newNoteContent.slice(0, start);
      const after = newNoteContent.slice(end);
      const updatedContent = before + selectedIcon + after;
      setNewNoteContent(updatedContent);
      // Move cursor after inserted icon
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = start + selectedIcon.length;
      }, 0);
    }
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
        {/* Show image preview above content textarea for LinkedIn-like experience */}
        {imagePreview && (
          <div className="mb-2">
            <img src={imagePreview} alt="Preview" className="rounded max-h-48 mx-auto" />
          </div>
        )}
        <div className="mb-4">
          <label htmlFor="newNoteContent" className="block mb-1 font-medium">
            Content:
          </label>
          <div className="relative">
            <Textarea
              id="newNoteContent"
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              rows={4}
              required
              className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900"
            />
            <button
              type="button"
              className="absolute right-2 top-2 text-2xl p-1 bg-gray-100 dark:bg-gray-800 rounded hover:bg-blue-100 dark:hover:bg-blue-900"
              onClick={() => setIconPickerOpen((open) => !open)}
              aria-label="Pick icon"
            >
              {icon || "😊"}
            </button>
            {iconPickerOpen && (
              <div className="absolute right-0 top-10 z-10 flex flex-wrap gap-2 bg-white dark:bg-gray-800 p-2 rounded shadow border border-gray-200 dark:border-gray-700">
                {["😊", "⭐", "🔥", "💡", "📷", "📚", "✅", "❗", "🎉", "📝", "😂", "👍", "🙏", "🥳", "😎", "🤔", "😃", "😢", "😡", "❤️", "🚀"].map((ic) => (
                  <button type="button" key={ic} className="text-2xl p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded" onClick={() => handleIconSelect(ic)}>{ic}</button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <Button type="submit" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded font-semibold">
            Add Note
          </Button>
          <button
            type="button"
            className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-2xl px-3 py-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900"
            onClick={() => document.getElementById('imageFile')?.click()}
            aria-label="Select Image"
          >
            <span role="img" aria-label="camera">📷</span>
          </button>
          <input
            id="imageFile"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
      </form>
    </div>
  );
};

export default NoteForm;
