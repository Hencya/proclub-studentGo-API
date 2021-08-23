const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fs = require('fs');

dotenv.config();

const app = express();

// connecting to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => console.log(err));

// routes
const eventContentRoutes = require('./routes/event');
const authRoutes = require('./routes/auth');
const archivesEventRoutes = require('./routes/archivesEvent');

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(express.static(`${__dirname}/public`));
app.use('/uploads', express.static('uploads'));

// Creating uploads folder if not already present
// In "uploads" folder we will temporarily upload
// image before uploading to cloudinary
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

app.use('/api/v1/users', authRoutes);
app.use('/api/v1/events', eventContentRoutes);
app.use('/api/v1/archives-events', archivesEventRoutes);

app.listen(process.env.PORT_DEV || process.env.PORT_PROD, () => {
  console.log(`Server bejalan di http://${process.env.HOST_DEV}:${process.env.PORT_DEV}`);
});
