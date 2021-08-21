const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();

modules.exports = {

};
// Creating uploads folder if not already present
// In "uploads" folder we will temporarily upload
// image before uploading to cloudinary
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(`${__dirname}/public`));
app.use('/uploads', express.static('uploads'));
