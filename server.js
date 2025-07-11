const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");
const { type } = require("os");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE_URL.replace(
  "<db_password>",
  process.env.PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connect succfully"));
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(` 🚒 App running on port ${port}...`);
});
