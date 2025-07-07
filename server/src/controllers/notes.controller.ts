import { Request, Response, RequestHandler } from "express";
import Note from "../models/Note";

// GET /api/notes
export const getNotes = async (req: Request, res: Response) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/notes
export const createNote = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const note = new Note({ title, content });
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ message: "Invalid data" });
  }
};

// PUT /api/notes/:id
export const updateNote: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const note = await Note.findByIdAndUpdate(
      id,
      { title, content },
      { new: true }
    );
    if (!note) {
      res.status(404).json({ message: "Note not found" });
      return;
    }
    res.json(note);
  } catch (error) {
    res.status(400).json({ message: "Invalid data" });
  }
};

// DELETE /api/notes/:id
export const deleteNote: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findByIdAndDelete(id);
    if (!note) {
      res.status(404).json({ message: "Note not found" });
      return;
    }
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: "Invalid request" });
  }
};
