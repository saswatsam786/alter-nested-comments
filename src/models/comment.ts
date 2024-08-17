import { Schema, model, Document, Types } from "mongoose";

// Define an interface for the Comment document
export interface IComment extends Document {
  postId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  text: string;
  parentCommentId?: Schema.Types.ObjectId | null;
  createdAt: Schema.Types.Date;
  updatedAt: Schema.Types.Date;
  replies: Types.DocumentArray<IComment>;
}

// Create a schema for the Comment model
const commentSchema = new Schema<IComment>(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    parentCommentId: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

// Define a virtual field for replies
commentSchema.virtual("replies", {
  ref: "Comment",
  localField: "_id",
  foreignField: "parentCommentId",
});

// Export the Comment model
export const Comment = model<IComment>("Comment", commentSchema);
