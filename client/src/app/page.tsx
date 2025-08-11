'use client';

import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import NoteForm from '../components/organisms/NoteForm';
import NoteList from '../components/organisms/NoteList';
import Button from '../components/atoms/Button';

interface Note {
  _id: string;
  title: string;
  content: string;
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const router = useRouter();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchNotes = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/notes', getAuthHeaders());
      setNotes(response.data);
    } catch (error) {
      const err = error as AxiosError;
      if (err.response && err.response.status === 401) {
        router.push('/auth/login');
      }
      console.error('Error fetching notes:', err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
    } else {
      fetchNotes();
    }
  }, [router, fetchNotes]); // Added fetchNotes to dependency array

  const createNote = async (title: string, content: string) => {
    try {
      await axios.post('http://localhost:4000/api/notes', {
        title,
        content,
      }, getAuthHeaders());
      fetchNotes(); // Refresh notes after creating a new one
    } catch (error) {
      const err = error as AxiosError;
      if (err.response && err.response.status === 401) {
        router.push('/auth/login');
      }
      console.error('Error creating note:', err);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await axios.delete(`http://localhost:4000/api/notes/${id}`, getAuthHeaders());
      fetchNotes(); // Refresh notes after deleting one
    } catch (error) {
      const err = error as AxiosError;
      if (err.response && err.response.status === 401) {
        router.push('/auth/login');
      }
      console.error('Error deleting note:', err);
    }
  };

  const startEditing = (note: Note) => {
    setEditingNoteId(note._id);
  };

  const cancelEditing = () => {
    setEditingNoteId(null);
  };

  const updateNote = async (id: string, title: string, content: string) => {
    try {
      await axios.put(`http://localhost:4000/api/notes/${id}`, {
        title,
        content,
      }, getAuthHeaders());
      cancelEditing(); // Exit editing mode
      fetchNotes(); // Refresh notes after updating one
    } catch (error) {
      const err = error as AxiosError;
      if (err.response && err.response.status === 401) {
        router.push('/auth/login');
      }
      console.error('Error updating note:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col items-center justify-start py-10">
      <div className="w-full max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight drop-shadow-sm">Quick Notes</h1>
          <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl shadow transition-colors ml-2.5">
            Logout
          </Button>
        </div>
        <div className="mb-8">
          <NoteForm onCreateNote={createNote} />
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-6">
          <h2 className="text-xl font-bold mb-6 text-gray-700 dark:text-gray-200">Your Notes</h2>
          <NoteList
            notes={notes}
            onEdit={startEditing}
            onDelete={deleteNote}
            onSave={updateNote}
            onCancelEdit={cancelEditing}
            editingNoteId={editingNoteId}
          />
        </div>
      </div>
    </div>
  );
}
