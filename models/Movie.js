const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      unique: true,
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [0, "Rating must be at least 0"],
      max: [10, "Rating cannot exceed 10"],
    },
    year: {
      type: Number,
      required: [true, "Release year is required"],
      min: [1900, "Year must be after 1900"],
      max: [new Date().getFullYear(), "Year cannot be in the future"],
    },
    genre: {
      type: [String],
      required: true,
      enum: {
        values: [
          "Action",
          "Comedy",
          "Drama",
          "Horror",
          "Sci-Fi",
          "Thriller",
          "Romance",
          "Documentary",
        ],
        message: "{VALUE} is not a valid genre",
      },
    },
    imageUrl: {
      type: String,
    },
    imageKey: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create unique index
movieSchema.index({ title: 1 }, { unique: true });

module.exports = mongoose.model("Movie", movieSchema);
