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
} from "../controllers/notes.controller";

const router = express.Router();

router.get("/", getNotes);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);
router.post("/:id/share", shareNote);
router.post("/:id/share-request", createNoteShareRequest);
router.get("/share-requests", listNoteShareRequests);
router.post("/share-requests/:requestId/accept", acceptNoteShareRequest);
router.post("/share-requests/:requestId/reject", rejectNoteShareRequest);

export default router;
