const express = require('express');
const dotenv = require('dotenv');
const dbConnection = require('./config/dbConnection');
const productRouter = require('./routes/productRoutes');
const userRouter = require('./routes/userRoutes');
const cors = require('cors');

const port = process.env.PORT || 8004; // Server runs on port 8004

dotenv.config(); // Load the environment variables
dbConnection(); // Retrieve db function
const app = express(); // Retrieve express
app.use(express.json()); // Parse JSON requests
app.use(cors());

app.use('/product', productRouter);
app.use('/user', userRouter);

app.listen(port, (error) => {
  if (error) {
    console.error(`Error: Server failed to start on port ${port}:`, error);
  } else {
    console.log(`Server successfully started on port ${port}`);
  }
});