import mongoose from "mongoose";
import { Counter } from "./Counter.js"; // Adjust the path as necessary
const UserProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,

    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  userId: { type: Number, unique: true },
});

UserProfileSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: "userId" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.userId = counter.seq;
    } catch (error) {
      console.error("Error generating userId:", error);
      next(error);
    }
  }
  next();
});

export default mongoose.models.Person ||
  mongoose.model("Person", UserProfileSchema, "persons");
