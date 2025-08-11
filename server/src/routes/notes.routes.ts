import express from "express";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  shareNote,
} from "../controllers/notes.controller";

const router = express.Router();

router.get("/", getNotes);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);
router.post("/:id/share", shareNote);

export default router;
