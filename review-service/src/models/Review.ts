import mongoose, { Schema, Document, Model } from "mongoose";

// Define the Review interface
interface ReviewDocument extends Document {
  title: string;
  text: string;
  rating: number;
  createdAt: Date;
  productId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
}

// Define the static methods interface
interface ReviewModel extends Model<ReviewDocument> {
  getRating(productId: string): Promise<void>;
}

// Define the Review schema
const ReviewSchema = new Schema<ReviewDocument>({
  title: {
    type: String,
    required: [true, "Please add a title"],
    trim: true,
    maxlength: [100, "Title cannot be longer than 100 characters"],
  },
  text: {
    type: String,
    required: [true, "Please add a text"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, "Please add a rating between 1 and 5"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// Add index
ReviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

// Define static method
ReviewSchema.statics.getRating = async function (productId: string) {
  const obj = await this.aggregate([
    { $match: { productId: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: "$productId",
        averageRating: { $avg: "$rating" },
      },
    },
  ]);
  try {
    await mongoose.model("Product").findByIdAndUpdate(productId, {
      averageRating: obj.length > 0 ? obj[0].averageRating : undefined,
    });
  } catch (error) {
    console.error(error);
  }
};

// Add post-save hook
ReviewSchema.post<ReviewDocument>("save", function () {
  (this.constructor as ReviewModel).getRating(this.productId.toString());
});

// Add pre-deleteOne hook
ReviewSchema.pre("deleteOne", { document: true, query: false }, function () {
  (this.constructor as ReviewModel).getRating(this.productId.toString());
});

// Export the model
export const Review = mongoose.model<ReviewDocument, ReviewModel>(
  "Review",
  ReviewSchema
);

