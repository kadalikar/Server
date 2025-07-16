const Movie = require("../models/Movie");
const s3Service = require("../services/s3.service");
const { google } = require("googleapis");
exports.getMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort("-createdAt");
    res.json({
      success: true,
      count: movies.length,
      data: movies,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
exports.createMovie = async (req, res) => {
  try {
    const { title, rating, year, genre } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Please upload a movie poster" });
    }

    // Upload image to S3
    const { url, key } = await s3Service.uploadFile(req.file, "movie-posters");

    // Create movie in MongoDB
    const movie = await Movie.create({
      title,
      rating: parseFloat(rating),
      year: parseInt(year),
      genre: Array.isArray(genre) ? genre : [genre],
      imageUrl: url,
      imageKey: key,
    });

    res.status(200).json({
      success: true,
      data: movie,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// exports.updateMovie = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, rating } = req.body;
//     const updateData = {};

//     // Dynamic $set object (ignores undefined fields)
//     if (title !== undefined) updateData.title = title;
//     if (rating !== undefined) updateData.rating = rating;

//     // Handle image upload
//     if (req.file) {
//       const movie = await Movie.findById(id);
//       const { url, key } = await s3Service.updateS3Image(
//         req.file,
//         movie?.imageKey
//       );
//       updateData.imageUrl = url;
//       updateData.imageKey = key;
//     }

//     const updatedMovie = await Movie.findByIdAndUpdate(
//       id,
//       { $set: updateData }, // Only updates provided fields
//       { new: true, runValidators: true }
//     );

//     res.status(200).json({ success: true, data: updatedMovie });
//   } catch (err) {
//     handleUpdateError(res, err); // Reusable error handler
//   }
// };

exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    res.status(400).json({
      status: "success",
      movies: movie,
    });
  } catch (err) {
    res.status(500).json({ err });
  }
};

exports.sheet = async (req, res) => {
  const { name, email, query, message } = req.body;

  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  // Create client instance for auth
  const client = await auth.getClient();

  // Instance of Google Sheets API
  const googleSheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetId = "1ikNgIj0C25QEPWToe4MiCB081eoRMxwTM72MJN_mqk8";

  // Get metadata about spreadsheet
  const metaData = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId,
  });

  // Read rows from spreadsheet
  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Sheet1!A:A",
  });

  // Write row(s) to spreadsheet
  await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "Sheet1!A:B",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [[name, email, query, message]],
    },
  });

  res.send("Successfully submitted! Thank you!");
};
