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
      type: String,
      required: [true, "Release year is required"],
    },
    genre: {
      type: [String],
      required: true,
      // enum: {
      //   values: [
      //     "Action",
      //     "Comedy",
      //     "Drama",
      //     "Horror",
      //     "Sci-Fi",
      //     "Thriller",
      //     "Romance",
      //     "Documentary",
      //   ],
      //   message: "{VALUE} is not a valid genre",
      // },
    },
    imageUrl: {
      type: String,
    },
    imageKey: {
      type: String,
    },
    completed: {
    type: Boolean,
    default: false // Default value for new documents
  },
  percentage: {
    type: Number,
    default: 0,    // Default value for new documents
    min: 0,        // Optional validation
    max: 100       // Optional validation
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
