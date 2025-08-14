import mongoose, { Document, Schema } from 'mongoose';

export interface INote extends Document {
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  owner: mongoose.Types.ObjectId;
  sharedWith: mongoose.Types.ObjectId[];
  imageUrl?: string;
  icon?: string;
  sentiment?: {
    score: number;
    label: 'positive' | 'negative' | 'neutral';
    confidence: number;
  };
  category?: string;
  aiAnalysis?: {
    processedAt: Date;
    keywords: string[];
    summary?: string;
  };
}

const NoteSchema = new Schema<INote>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sharedWith: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  imageUrl: { type: String },
  icon: { type: String },
  sentiment: {
    score: { type: Number },
    label: { type: String, enum: ['positive', 'negative', 'neutral'] },
    confidence: { type: Number }
  },
  category: { type: String },
  aiAnalysis: {
    processedAt: { type: Date },
    keywords: [{ type: String }],
    summary: { type: String }
  }
}, { timestamps: true });

export default mongoose.model<INote>('Note', NoteSchema);
