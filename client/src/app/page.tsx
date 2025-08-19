'use client';

import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import NoteForm from '../components/organisms/NoteForm';
import NoteList from '../components/organisms/NoteList';
import Button from '../components/atoms/Button';
import NotificationBell from '../components/organisms/NotificationBell';
import ThemeToggleButton from '../components/atoms/ThemeToggleButton';
import AnalyticsDashboard from '../components/organisms/AnalyticsDashboard';

interface Note {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  icon?: string;
  sentiment?: {
    score: number;
    label: 'positive' | 'negative' | 'neutral';
    confidence: number;
  };
  category?: string;
  aiAnalysis?: {
    processedAt: string;
    keywords: string[];
    summary?: string;
  };
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');
  const [showAnalytics, setShowAnalytics] = useState<boolean>(false);
  const router = useRouter();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchNotes = useCallback(async () => {
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
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
    } else {
      fetchNotes();
      // Fetch user info
      axios.get('http://localhost:4000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        setUsername(res.data.username);
      }).catch(() => {
        setUsername('');
      });
    }
  }, [router, fetchNotes]); // Now fetchNotes is stable

  const createNote = async (title: string, content: string, imageUrl?: string, icon?: string) => {
    try {
      await axios.post('http://localhost:4000/api/notes', {
        title,
        content,
        imageUrl,
        icon,
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

  const updateNote = async (id: string, title: string, content: string, imageUrl?: string, icon?: string) => {
    try {
      await axios.put(`http://localhost:4000/api/notes/${id}`, {
        title,
        content,
        imageUrl,
        icon,
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
  <div className="min-h-screen bg-background flex flex-col items-center justify-start py-10">
  <div className="fixed top-6 right-6 z-50">
    <NotificationBell onNoteShared={fetchNotes} />
  </div>
  <div className="w-full max-w-2xl mx-auto px-2 sm:px-0">
  <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight drop-shadow-sm mb-6 sm:mb-8">Quick Notes</h1>
        <div className="flex flex-col mb-6 sm:mb-8">
          <div className="flex justify-between sm:items-center gap-4 sm:gap-0 mb-4">
            {username && (
              <div className="flex items-center gap-2 px-3 py-1 bg-secondary rounded-xl border border-border shadow-lg w-fit mx-auto sm:mx-0">
                <div className="w-8 h-8 rounded-full bg-card flex items-center justify-center text-primary font-bold text-md border-2 border-primary shadow">
                  {username.slice(0, 2).toUpperCase()}
                </div>
                <span className="hidden sm:inline font-bold text-foreground text-base ml-2">{username}</span>
              </div>
            )}
            <div className="flex gap-2">
              <Button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="bg-primary hover:bg-secondary text-primary-foreground px-4 py-2 rounded-xl shadow transition-colors w-full sm:w-auto text-sm sm:text-base"
              >
                {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
              </Button>
              <Button onClick={handleLogout} className="bg-danger hover:bg-accent text-primary-foreground px-4 py-2 rounded-xl shadow transition-colors w-full sm:w-auto text-sm sm:text-base">
                Logout
              </Button>
              <div className="flex items-center">
                <ThemeToggleButton />
              </div>
            </div>
          </div>
        </div>
  <div className="mb-6 sm:mb-8">
          <NoteForm onCreateNote={createNote} />
        </div>
        {showAnalytics && (
          <div className="mb-6 sm:mb-8">
            <AnalyticsDashboard />
          </div>
        )}
        <div className="bg-card rounded-2xl shadow-xl border border-border p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-foreground">Your Notes</h2>
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
