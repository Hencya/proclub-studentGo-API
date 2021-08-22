const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const bodyParser = require('body-parser');

// routes
const eventContentRoutes = require('./routes/event');
const authRoutes = require('./routes/auth');

dotenv.config();
const app = express();

// connecting to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
}).then(() => {
  app.listen(process.env.PORT_DEV || process.env.PORT_PROD, () => {
    console.log(`Server bejalan di http://${process.env.HOST_DEV}:${process.env.PORT_DEV}`);
  });
}).catch((err) => console.log(err));

// Creating uploads folder if not already present
// In "uploads" folder we will temporarily upload
// image before uploading to cloudinary
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(`${__dirname}/public`));
app.use('/uploads', express.static('uploads'));

app.use('/api/v1/users', authRoutes);
app.use('/api/v1/event', eventContentRoutes);
