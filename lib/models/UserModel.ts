import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
  isim: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema: Schema = new Schema(
  {
    isim: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const UserModel =
  mongoose.models?.User || mongoose.model<IUser>("User", UserSchema);

export default UserModel;
