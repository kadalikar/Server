// const express = require("express");

// const moviesController = require("./../controllers/moviesController");

// const router = express.Router();

// router.route("/").get(moviesController.getAllMovies);

// module.exports = router;

const express = require("express");
const router = express.Router();
const upload = require("../config/multer.config");
const {
  createMovie,
  getMovies,
  updateMovie,
  deleteMovie,
} = require("../controllers/moviesController");
const googleSheet = require("../controllers/moviesController");
const validateMiddleware = require("../middleware/validateMovie");

router.route("/sheet").post(googleSheet.sheet);
router
  .route("/")
  .post(
    upload.single("poster"),
    validateMiddleware.checkUniqueTitle,
    createMovie
  )
  .get(getMovies);

router
  .route("/:id")
  .put(upload.single("poster"), updateMovie)
  .delete(deleteMovie);

module.exports = router;
