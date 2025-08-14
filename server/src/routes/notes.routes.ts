import express from "express";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  shareNote,
  createNoteShareRequest,
  listNoteShareRequests,
  acceptNoteShareRequest,
  rejectNoteShareRequest,
  getNotesAnalytics,
  reanalyzeAllNotes,
} from "../controllers/notes.controller";
import { upload, uploadImage } from "../controllers/upload.controller";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", getNotes);
router.get("/analytics", getNotesAnalytics);
router.post("/reanalyze", reanalyzeAllNotes);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);
router.post("/:id/share", shareNote);
router.post("/:id/share-request", createNoteShareRequest);
router.get("/share-requests", listNoteShareRequests);
router.post("/share-requests/:requestId/accept", acceptNoteShareRequest);
router.post("/share-requests/:requestId/reject", rejectNoteShareRequest);
// Image upload endpoint
router.post("/upload-image", authMiddleware, upload.single("image"), uploadImage);

export default router;
