const express = require("express");
const morgan = require("morgan");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
require("./backend/connection/mongoose");
const route = require("./backend/routes/userRouters");


const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



app.use("/api", route);

app.use(async (req, res, next) => {
  next(createError.NotFound());
});

// app.use((err, req, res, next) => {
//   res.status(err.status || 500);
//   res.send({
//     error: {
//       status: err.status || 500,
//       message: err.message,
//     },
//   });
// });

app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    return res.status(400).send({
      status: err.status || 400,
      type: "ValidationError",
      message: err.message,
      //details: error.details,
    });
  }
  if (err.name === "CastError") {
    return res.status(400).send({
      status: err.status,
      type: "CastError",
      message:
        err.message ||
        "Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer",
    });
  }

  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

const PORT = process.env.PORT || 3000;

app.listen(3000, () => {
  console.log("Your app is listing on http://localhost:3000");
});
