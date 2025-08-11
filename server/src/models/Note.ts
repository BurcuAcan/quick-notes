import mongoose, { Document, Schema } from 'mongoose';

export interface INote extends Document {
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  owner: mongoose.Types.ObjectId;
  sharedWith: mongoose.Types.ObjectId[];
}

const NoteSchema = new Schema<INote>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sharedWith: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

export default mongoose.model<INote>('Note', NoteSchema);
