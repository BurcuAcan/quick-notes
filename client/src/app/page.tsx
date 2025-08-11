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
    <div className="p-5 font-sans">
      <div className="flex justify-between items-center mb-5">
        <h1>Quick Notes</h1>
        <div className="flex items-center">
          <Button onClick={handleLogout} className="bg-red-600 px-4 py-2 ml-2.5">
            Logout
          </Button>
        </div>
      </div>

      <NoteForm onCreateNote={createNote} />

      <h2>Your Notes</h2>
      <NoteList
        notes={notes}
        onEdit={startEditing}
        onDelete={deleteNote}
        onSave={updateNote}
        onCancelEdit={cancelEditing}
        editingNoteId={editingNoteId}
      />
    </div>
  );
}
