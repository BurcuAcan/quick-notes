'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
    } else {
      fetchNotes();
    }
  }, []);

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
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        router.push('/auth/login'); // Redirect to login if unauthorized
      }
      console.error('Error fetching notes:', error);
    }
  };

  const createNote = async (title: string, content: string) => {
    try {
      await axios.post('http://localhost:4000/api/notes', {
        title,
        content,
      }, getAuthHeaders());
      fetchNotes(); // Refresh notes after creating a new one
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        router.push('/auth/login');
      }
      console.error('Error creating note:', error);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await axios.delete(`http://localhost:4000/api/notes/${id}`, getAuthHeaders());
      fetchNotes(); // Refresh notes after deleting one
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        router.push('/auth/login');
      }
      console.error('Error deleting note:', error);
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
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        router.push('/auth/login');
      }
      console.error('Error updating note:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth/login');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Quick Notes</h1>
        <Button onClick={handleLogout} style={{ backgroundColor: '#dc3545', padding: '8px 15px' }}>
          Logout
        </Button>
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
