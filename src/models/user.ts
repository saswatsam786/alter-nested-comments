import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const User = model<IUser>("User", userSchema);

export { User };
