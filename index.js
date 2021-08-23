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

// routes user
const authRoutes = require('./routes/auth');
// routes event
const eventContentRoutes = require('./routes/event');
const archivesEventRoutes = require('./routes/archivesEvent');
// routes Scholarship
const scholarshipRoutes = require('./routes/scholarships/scholarships');
const archivesScholarshipRoutes = require('./routes/scholarships/archivesScholarship');
// routes Course
const courseRoutes = require('./routes/courses/courses');

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

// user
app.use('/api/v1/users', authRoutes);
// event
app.use('/api/v1/events', eventContentRoutes);
app.use('/api/v1/archives-events', archivesEventRoutes);
// scholarship
app.use('/api/v1/scholarships', scholarshipRoutes);
app.use('/api/v1/archives-scholarship', archivesScholarshipRoutes);
// course
app.use('/api/v1/courses', courseRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log('Server is running');
});
