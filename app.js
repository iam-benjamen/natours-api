const express = require("express");
const morgan = require("morgan");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express(); //expose the express apis

//middlewares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); //for loggging only in development environment
}

app.use(express.json()); //an express to parse info into json
app.use(express.static(`${__dirname}/public`)); //serving static files
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//custom routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tours", tourRouter);

//handle any request without a response
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
}); 

//Handling any unhamdled routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 400));
});

//Express global error handler
app.use(globalErrorHandler);
module.exports = app;
