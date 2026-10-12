import mongoose, { Schema } from "mongoose";
import { Counter } from "./Counter";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true }, // plain text password
    name: { type: String, required: true },
    userId: { type: Number, unique: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Auto-increment userId
userSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "userId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.userId = counter.seq;
  }
  next();
});

// ✅ Plain-text password comparison
userSchema.methods.comparePassword = async function (candidatePassword) {
  return candidatePassword === this.password;
};

const User =
  mongoose.models.User || mongoose.model("User", userSchema, "users");

export default User;
