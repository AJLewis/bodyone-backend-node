
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI as string, { 
    dbName: process.env.MONGODB_DB_NAME as string, 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
  })
  .then(() => console.log('Database connected!'))
  .catch((err: any) => console.log(err));