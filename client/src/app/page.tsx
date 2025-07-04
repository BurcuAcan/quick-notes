'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface Note {
  _id: string;
  title: string;
  content: string;
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/notes');
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const createNote = async () => {
    try {
      await axios.post('http://localhost:4000/api/notes', {
        title: newNoteTitle,
        content: newNoteContent,
      });
      setNewNoteTitle('');
      setNewNoteContent('');
      fetchNotes(); // Refresh notes after creating a new one
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await axios.delete(`http://localhost:4000/api/notes/${id}`);
      fetchNotes(); // Refresh notes after deleting one
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const startEditing = (note: Note) => {
    setEditingNoteId(note._id);
    setEditedTitle(note.title);
    setEditedContent(note.content);
  };

  const cancelEditing = () => {
    setEditingNoteId(null);
    setEditedTitle('');
    setEditedContent('');
  };

  const updateNote = async (id: string) => {
    try {
      await axios.put(`http://localhost:4000/api/notes/${id}`, {
        title: editedTitle,
        content: editedContent,
      });
      cancelEditing(); // Exit editing mode
      fetchNotes(); // Refresh notes after updating one
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Quick Notes</h1>

      <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
        <h2>Add New Note</h2>
        <input
          type="text"
          placeholder="Title"
          value={newNoteTitle}
          onChange={(e) => setNewNoteTitle(e.target.value)}
          style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <textarea
          placeholder="Content"
          value={newNoteContent}
          onChange={(e) => setNewNoteContent(e.target.value)}
          rows={4}
          style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
        ></textarea>
        <button
          onClick={createNote}
          style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Add Note
        </button>
      </div>

      <h2>Your Notes</h2>
      {notes.length === 0 ? (
        <p>No notes yet. Add one above!</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {notes.map((note) => (
            <div key={note._id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              {editingNoteId === note._id ? (
                <>
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    rows={4}
                    style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                  ></textarea>
                  <button
                    onClick={() => updateNote(note._id)}
                    style={{ padding: '8px 12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEditing}
                    style={{ padding: '8px 12px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <h3>{note.title}</h3>
                  <p>{note.content}</p>
                  <button
                    onClick={() => startEditing(note)}
                    style={{ padding: '8px 12px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteNote(note._id)}
                    style={{ padding: '8px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
