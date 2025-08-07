import mongoose from "mongoose";
export default interface IRoles extends mongoose.Document {
  name: string;
  description: string | null;
  permissions: mongoose.Schema.Types.ObjectId[];
  users: mongoose.Schema.Types.ObjectId[];
}