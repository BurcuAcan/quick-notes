import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import notesRouter from "./routes/notes.routes";
import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import { protect } from "./middleware/authMiddleware";
import { connectDB } from "./lib/db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);

app.use("/api/notes", protect, notesRouter);

app.use("/api/users", protect, userRouter);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
