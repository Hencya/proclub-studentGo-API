/* eslint-disable no-plusplus */
const fs = require('fs');
const cloudinary = require('../utils/cloudinary');
const EventContent = require('../models/EventContent');

module.exports = {
  createeventContent: async (req, res) => {
    try {
      if (!req.files) {
        const err = new Error('Image must be uploaded');
        err.errorStatus = 422;
        throw err;
      }

      const urls = [];
      const publicId = [];
      for (const file of req.files) {
        const { path } = file;
        const newPath = await cloudinary.uploader.upload(path, {
          upload_preset: 'StudentGo',
        });
        urls.push(newPath.secure_url);
        publicId.push(newPath.public_id);
        fs.unlinkSync(path);
      }

      const {
        //! nanti diambil dari req.user => jwt => GANTI REQ.BODY.USER DENGAN REQ.USER DAN HAPUS USER DI BODY POSTMAN
        user,
        title,
        broadcast_media,
        category,
        description,
        date_start_event,
        date_end_event,
        start_event,
        end_event,
        tags,
        price,
        organizer_name,
        no_hp,
        organizer_email,
      } = req.body;
      const newEventContent = new EventContent({
        user,
        title,
        broadcast_media,
        category,
        description,
        date_start_event,
        date_end_event,
        start_event,
        end_event,
        tags,
        price,
        organizer_name,
        no_hp,
        organizer_email,
        imagesUrl: urls,
        cloudinary_id: publicId,
      });
      req.cloud_id = publicId[publicId.length - 1];
      const savedEventContent = await newEventContent.save();
      res.status(201).json({
        status: 201,
        message: 'Success Create New a Cotent Event',
        result: savedEventContent,
      });
    } catch (error) {
      console.error(error);
      if (error.code === 11000) {
        await cloudinary.uploader.destroy(req.cloud_id);
        return res.status(409).json({ message: 'Registration link already exists (must be unique)' });
      }
      await cloudinary.uploader.destroy(req.cloud_id);
      res.status(500).json({ message: error });
    }
  },
};
