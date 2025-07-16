// const express = require("express");

// const app = express();

// const moviesRouter = require("./routes/moviesRouter");
// const morgan = require("morgan");

// // 1) MIDDLEWARES
// if (process.env.NODE_ENV === "development") {
//   app.use(morgan("dev"));
// }

// app.use(cors()); // Enable all CORS requests
// // OR for more control:
// app.use(
//   cors({
//     origin: "http://localhost:4200", // Your Angular dev server
//   })
// );

// app.use(express.json());

// app.use(express.static(`${__dirname}/public`));

// app.use((req, res, next) => {
//   console.log("Hello from the middleware 👋");
//   next();
// });

// app.use("/api/v1/movies", moviesRouter);

require("dotenv").config();
const express = require("express");

const cors = require("cors");

const movieRoutes = require("./routes/moviesRouter");

const app = express();

// Middleware
app.use(express.json());

app.use(cors()); // Enable all CORS requests
// OR for more control:
app.use(
  cors({
    origin: "https://grace-minsitries.netlify.app", // Your Angular dev server
  })
);

// Routes
app.use("/api/movies", movieRoutes);

console.log(movieRoutes);
// Error handling
// app.use(errorHandler);

module.exports = app;
