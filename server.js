const mongoose = require("mongoose");
const dotenv = require("dotenv"); //for accessing the environment variables
dotenv.config({ path: "./config.env" }); //link the environment variables

process.on('uncaughtException', err => {
  console.log('uncaught exceptions shutting down')
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require("./app");

//Connect to database
const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);
mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify:false,
  useUnifiedTopology: true 
}).then(con =>{
  console.log('DB connected successsfully');
});

const port = process.env.port || 3002;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

//Any other failed async promises in the app
process.on('unhandledRejection', err =>{
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION, SHUTTING DOWN APP');

  server.close(() => {
    process.exit(1);
  })
});

