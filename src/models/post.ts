import { Schema, model, Document } from "mongoose";

export interface IPost extends Document {
  title: string;
  content: string;
  userId: Schema.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const postSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

export const Post = model<IPost>("Post", postSchema);
