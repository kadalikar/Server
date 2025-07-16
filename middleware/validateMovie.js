const Movie = require("../models/Movie");

const checkUniqueTitle = async (req, res, next) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const existingMovie = await Movie.findOne({ title });
    if (existingMovie) {
      return res.status(409).json({
        error: "Movie title already exists",
      });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { checkUniqueTitle };
