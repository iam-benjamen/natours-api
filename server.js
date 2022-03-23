const dotenv = require('dotenv')
dotenv.config({path: './config.env'}) //link the environment variables


const app = require('./app')

const port = process.env.port || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
