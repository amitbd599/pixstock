import mongoose, { Schema, models, Document } from "mongoose";

export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string; // hashed
  role: "admin";
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    name: {
      type: String,
      required: true,
      default: "Admin",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "admin",
      enum: ["admin"],
    },
  },
  { timestamps: true, versionKey: false },
);

const Admin = models.Admin || mongoose.model<IAdmin>("Admin", AdminSchema);
export default Admin;
