// models/PersonDetails.js
import mongoose from "mongoose";
import { Counter } from "./Counter.js"; // Adjust the path as necessary

const PersonDetailsSchema = new mongoose.Schema({
  userId: { type: Number, required: true, unique: true }, // foreign key
  name: { type: String },
  Designation: { type: String },
  Description: { type: String },
  Country: { type: String },
  // Add any other fields you want
});

PersonDetailsSchema.pre("save", async function (next) {
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

export default mongoose.models.PersonDetails ||
  mongoose.model("PersonDetails", PersonDetailsSchema, "personDetails");
