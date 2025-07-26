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
const loginRoute = require("./routes/loginRouter");

const globalHandler = require("./controllers/errorHandler");
const AppError = require("./utilis/AppError");
const app = express();

console.log("Current environment:", process.env.NODE_ENV);
// Middleware
app.use(express.json());

app.use(cors()); // Enable all CORS requests
// OR for more control:
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

// Routes
app.use("/api/movies", movieRoutes);

app.use("/login", loginRoute);

// app.all("*", (req, res, next) => {
//   next(AppError(`cant find the route ${req.originalUrl}`));
// });

app.use(globalHandler);

// Error handling
// app.use(errorHandler);

module.exports = app;
