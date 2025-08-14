import { Request, Response, RequestHandler } from "express";
import Note from "../models/Note";
import NoteShareRequest from "../models/NoteShareRequest";
import User from "../models/User";
import { analyzeContent } from "../services/aiAnalysis.service";

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
    const { title, content, imageUrl, icon } = req.body;
    
    // Run AI analysis
    const analysis = analyzeContent(title, content);
    
    const note = new Note({ 
      title, 
      content, 
      imageUrl, 
      icon, 
      owner: req.user._id,
      sentiment: analysis.sentiment,
      category: analysis.category,
      aiAnalysis: {
        processedAt: new Date(),
        keywords: analysis.keywords,
        summary: analysis.summary
      }
    });
    
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

// POST /api/notes/:id/share-request
export const createNoteShareRequest: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params; // note id
    const { recipientEmail } = req.body;
    const senderId = req.user._id;
    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    if (note.owner.toString() !== senderId.toString()) {
      return res.status(403).json({ message: "Only owner can share the note" });
    }
    const recipient = await User.findOne({ email: recipientEmail });
    if (!recipient) return res.status(404).json({ message: "Recipient not found" });
    // Prevent duplicate requests
    const existing = await NoteShareRequest.findOne({ sender: senderId, recipient: recipient._id, note: id, status: "pending" });
    if (existing) return res.status(400).json({ message: "Share request already pending" });
    const request = new NoteShareRequest({ sender: senderId, recipient: recipient._id, note: id });
    await request.save();
    // TODO: send notification email to recipient
    res.status(201).json(request);
  } catch (error) {
    res.status(400).json({ message: "Invalid request" });
  }
};

// GET /api/share-requests
export const listNoteShareRequests: RequestHandler = async (req, res) => {
  try {
    const userId = req.user._id;
    // Incoming requests (to user)
    const incoming = await NoteShareRequest.find({ recipient: userId, status: "pending" }).populate("note sender");
    // Outgoing requests (from user)
    const outgoing = await NoteShareRequest.find({ sender: userId, status: "pending" }).populate("note recipient");
    res.json({ incoming, outgoing });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/share-requests/:requestId/accept
export const acceptNoteShareRequest: RequestHandler = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;
    const request = await NoteShareRequest.findById(requestId);
    if (!request || request.recipient.toString() !== userId.toString()) {
      return res.status(404).json({ message: "Request not found" });
    }
    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already processed" });
    }
    request.status = "accepted";
    await request.save();
    // Add recipient to note.sharedWith
    const note = await Note.findById(request.note);
    if (note && !note.sharedWith.includes(userId)) {
      note.sharedWith.push(userId);
      await note.save();
    }
    res.json({ message: "Note shared", request });
  } catch (error) {
    res.status(400).json({ message: "Invalid request" });
  }
};

// POST /api/share-requests/:requestId/reject
export const rejectNoteShareRequest: RequestHandler = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;
    const request = await NoteShareRequest.findById(requestId);
    if (!request || request.recipient.toString() !== userId.toString()) {
      return res.status(404).json({ message: "Request not found" });
    }
    if (request.status !== "pending") {
      return res.status(400).json({ message: "Request already processed" });
    }
    request.status = "rejected";
    await request.save();
    res.json({ message: "Request rejected", request });
  } catch (error) {
    res.status(400).json({ message: "Invalid request" });
  }
};

// PUT /api/notes/:id
export const updateNote: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, imageUrl, icon } = req.body;
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
    
    // Re-run AI analysis if content changed
    let shouldAnalyze = false;
    if (title !== note.title || content !== note.content) {
      shouldAnalyze = true;
    }
    
    note.title = title;
    note.content = content;
    if (imageUrl !== undefined) note.imageUrl = imageUrl;
    if (icon !== undefined) note.icon = icon;
    
    if (shouldAnalyze) {
      const analysis = analyzeContent(title, content);
      note.sentiment = analysis.sentiment;
      note.category = analysis.category;
      note.aiAnalysis = {
        processedAt: new Date(),
        keywords: analysis.keywords,
        summary: analysis.summary
      };
    }
    
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

// GET /api/notes/analytics
export const getNotesAnalytics: RequestHandler = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get user's notes (owned + shared)
    const notes = await Note.find({
      $or: [
        { owner: userId },
        { sharedWith: userId }
      ]
    });

    // Calculate analytics
    const analytics = {
      totalNotes: notes.length,
      sentimentDistribution: {
        positive: notes.filter(n => n.sentiment?.label === 'positive').length,
        negative: notes.filter(n => n.sentiment?.label === 'negative').length,
        neutral: notes.filter(n => n.sentiment?.label === 'neutral').length
      },
      categoryDistribution: notes.reduce((acc: { [key: string]: number }, note) => {
        if (note.category) {
          acc[note.category] = (acc[note.category] || 0) + 1;
        }
        return acc;
      }, {}),
      averageSentimentScore: notes.length > 0 
        ? notes.reduce((sum, note) => sum + (note.sentiment?.score || 0), 0) / notes.length
        : 0,
      topKeywords: notes
        .flatMap(note => note.aiAnalysis?.keywords || [])
        .reduce((acc: { [key: string]: number }, keyword) => {
          acc[keyword] = (acc[keyword] || 0) + 1;
          return acc;
        }, {}),
      recentActivity: {
        thisWeek: notes.filter(n => 
          new Date(n.updatedAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
        ).length,
        thisMonth: notes.filter(n => 
          new Date(n.updatedAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000
        ).length
      }
    };

    // Convert topKeywords to sorted array
    const sortedKeywords = Object.entries(analytics.topKeywords)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([keyword, count]) => ({ keyword, count }));

    res.json({
      ...analytics,
      topKeywords: sortedKeywords
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/notes/reanalyze
export const reanalyzeAllNotes: RequestHandler = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get user's notes without sentiment analysis
    const notes = await Note.find({
      $or: [
        { owner: userId },
        { sharedWith: userId }
      ]
    });

    let updated = 0;
    
    for (const note of notes) {
      // Re-run AI analysis for all notes
      const analysis = analyzeContent(note.title, note.content);
      
      note.sentiment = analysis.sentiment;
      note.category = analysis.category;
      note.aiAnalysis = {
        processedAt: new Date(),
        keywords: analysis.keywords,
        summary: analysis.summary
      };
      
      await note.save();
      updated++;
    }

    res.json({ 
      message: `Successfully reanalyzed ${updated} notes`,
      updated 
    });
  } catch (error) {
    console.error('Reanalysis error:', error);
    res.status(500).json({ message: "Server error during reanalysis" });
  }
};
