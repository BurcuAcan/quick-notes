import { Request, Response, RequestHandler } from "express";
import Note from "../models/Note";

// GET /api/notes
export const getNotes = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const notes = await Note.find({
      $or: [
        { owner: userId },
        { sharedWith: userId }
      ]
    });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/notes
export const createNote = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const note = new Note({ title, content, owner: req.user._id });
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ message: "Invalid data" });
  }
};

// POST /api/notes/:id/share
export const shareNote: RequestHandler = async (req, res) => {
  console.log("Sharing note");
  try {
    const { id } = req.params;
    const { userId } = req.body; // paylaşılan kişinin id'si
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    // Sadece sahibi paylaşabilir
    if (note.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only owner can share the note" });
    }
    if (!note.sharedWith.includes(userId)) {
      note.sharedWith.push(userId);
      await note.save();
    }
    res.json(note);
  } catch (error) {
    res.status(400).json({ message: "Invalid request" });
  }
};

// PUT /api/notes/:id
export const updateNote: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    // Sadece sahibi veya paylaşılan kişi düzenleyebilir
    const userId = req.user._id.toString();
    if (
      note.owner.toString() !== userId &&
      !note.sharedWith.map((id) => id.toString()).includes(userId)
    ) {
      return res.status(403).json({ message: "No edit permission" });
    }
    note.title = title;
    note.content = content;
    await note.save();
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
