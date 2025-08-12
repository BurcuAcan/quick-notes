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
      const res = await fetch('http://localhost:4000/api/notes/upload-image', {
        method: 'POST',
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
        <div>
          <label className="block mb-1 font-medium">Image:</label>
          <Button type="button" className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => document.getElementById('imageFile')?.click()}>
            {imageFile ? 'Change Image' : 'Select Image'}
          </Button>
          <input
            id="imageFile"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Icon:</label>
          <Button type="button" className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => setIconPickerOpen(true)}>
            {icon ? `Change Icon (${icon})` : 'Select Icon'}
          </Button>
          {iconPickerOpen && (
            <div className="mt-2 flex flex-wrap gap-2 bg-white dark:bg-gray-800 p-2 rounded shadow border border-gray-200 dark:border-gray-700">
              {["😊","⭐","🔥","💡","📷","📚","✅","❗","🎉","📝"].map((ic) => (
                <button type="button" key={ic} className="text-2xl p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded" onClick={() => handleIconSelect(ic)}>{ic}</button>
              ))}
            </div>
          )}
        </div>
        <Button type="submit" >
          Add Note
        </Button>
      </form>
    </div>
  );
};

export default NoteForm;
