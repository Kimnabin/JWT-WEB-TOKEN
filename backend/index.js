const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

const authRoute = require('./routers/auth');
const userRoute = require('./routers/user');

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
app.use('/v1/auth', authRoute);
app.use('/v1/user', userRoute);

app.listen(8000, () => {
    console.log('Server is running on port 8000');
})

// JWT WEB TOKEN
