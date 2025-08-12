import mongoose, { Schema, Document, Types } from 'mongoose';

export interface INoteShareRequest extends Document {
  sender: Types.ObjectId; // User who wants to share
  recipient: Types.ObjectId; // User to share with
  note: Types.ObjectId; // Note to be shared
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const NoteShareRequestSchema = new Schema<INoteShareRequest>({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  note: { type: Schema.Types.ObjectId, ref: 'Note', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
}, { timestamps: true });

export default mongoose.model<INoteShareRequest>('NoteShareRequest', NoteShareRequestSchema);
