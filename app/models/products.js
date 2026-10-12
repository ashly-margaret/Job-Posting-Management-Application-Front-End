import mongoose from "mongoose";
const ProductProfileSchema = new mongoose.Schema({
  product_url: {
    type: String,
    required: true,
  },
  product_name: {
    type: String,

    required: true,
  },

  product_desc: {
    type: String,
    required: true,
  },

  "product-price": {
    type: String,
    required: true,
  },
  userId: { type: Number, unique: true },
});

ProductProfileSchema.pre("save", async function (next) {
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

export default mongoose.models.Product ||
  mongoose.model("Product", ProductProfileSchema, "products");
