const mongoose = require("mongoose")
const dotenv = require("dotenv"); //for accessing the environment variables
dotenv.config({ path: "./config.env" }); //link the environment variables

const app = require("./app");

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

const port = process.env.port || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
