const cloudinary = require('../utils/cloudinary');
const EventContent = require('../models/EventContent');
const ArchiveEvent = require('../models/ArchiveEvent');

module.exports = {
  createEventContent: async (req, res) => {
    const publicIdList = [];
    try {
      if (!req.files) {
        const err = new Error('Image must be uploaded');
        err.errorStatus = 422;
        throw err;
      }

      const newPoster = await cloudinary.uploader.upload(req.files.poster[0].path, {
        upload_preset: 'StudentGo',
      });
      const newImage1 = await cloudinary.uploader.upload(req.files.image1[0].path, {
        upload_preset: 'StudentGo',
      });
      const newLogo = await cloudinary.uploader.upload(req.files.logo[0].path, {
        upload_preset: 'StudentGo',
      });
      const newImage2 = await cloudinary.uploader.upload(req.files.image2[0].path, {
        upload_preset: 'StudentGo',
      });
      const newImage3 = await cloudinary.uploader.upload(req.files.image3[0].path, {
        upload_preset: 'StudentGo',
      });
      const newImage4 = await cloudinary.uploader.upload(req.files.image4[0].path, {
        upload_preset: 'StudentGo',
      });

      const {
        //! nanti diambil dari req.user => jwt => GANTI REQ.BODY.USER DENGAN REQ.USER DAN HAPUS USER DI BODY POSTMAN
        user,
        title,
        broadcast_media,
        category,
        description,
        deadline,
        date_start_event,
        date_end_event,
        start_event,
        end_event,
        tags,
        price,
        organizer_name,
        no_hp,
        organizer_email,
        no_rekening,
        user_bank,
        name_bank,
      } = req.body;
      const newEventContent = new EventContent({
        user,
        title,
        broadcast_media,
        category,
        description,
        deadline,
        date_start_event,
        date_end_event,
        start_event,
        end_event,
        tags,
        price,
        organizer_name,
        no_hp,
        organizer_email,
        poster: newPoster.secure_url,
        logo: newLogo.secure_url,
        image_1: newImage1.secure_url,
        image_2: newImage2.secure_url,
        image_3: newImage3.secure_url,
        image_4: newImage4.secure_url,
        cld_poster_id: newPoster.public_id,
        cld_logo_id: newLogo.public_id,
        cld_image_1_id: newImage1.public_id,
        cld_image_2_id: newImage2.public_id,
        cld_image_3_id: newImage3.public_id,
        cld_image_4_id: newImage4.public_id,
        no_rekening,
        user_bank,
        name_bank,
      });

      // untuk nampung jika terjadi error (hapus images di cloudinary)
      publicIdList.push(newPoster.public_id);
      publicIdList.push(newLogo.public_id);
      publicIdList.push(newImage1.public_id);
      publicIdList.push(newImage2.public_id);
      publicIdList.push(newImage3.public_id);
      publicIdList.push(newImage4.public_id);

      const savedEventContent = await newEventContent.save();

      res.status(201).json({
        status: 201,
        message: 'Success Create New a Cotent Event',
        result: savedEventContent,
      });
    } catch (error) {
      console.error(error);
      if (error.code === 11000) {
        for (let i = 0; i < publicIdList.length; i++) {
          await cloudinary.uploader.destroy(publicIdList[i]);
        }
        publicIdList.splice(0, publicIdList.length);
        return res.status(409).json({ message: 'Cloudinary Id must be unique' });
      }
      for (let i = 0; i < publicIdList.length; i++) {
        await cloudinary.uploader.destroy(publicIdList[i]);
      }
      publicIdList.splice(0, publicIdList.length);
      res.status(500).json({ message: error });
    }
  },

  getAllEventContentSkipFive: async (req, res) => {
    try {
      const events = await EventContent.find().select(
        '_id title poster deadline description slug tags',
      ).skip(5).sort({ createdAt: 'desc' });

      if (!events) {
        const error = new Error('Event Doesnt Exist');
        error.errorStatus = 404;
        throw error;
      }

      res.status(200).json({
        status: 200,
        message: 'Success Get All Events',
        result: events,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error });
    }
  },

  getLatestEventContent: async (req, res) => {
    try {
      const events = await EventContent.find().select(
        '_id title poster deadline description slug tags',
      ).limit(5).sort({ createdAt: 'desc' });

      if (!events) {
        const error = new Error('Event Doesnt Exist');
        error.errorStatus = 404;
        throw error;
      }

      res.status(200).json({
        status: 200,
        message: 'Success Get 5 Latest Events',
        result: events,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error });
    }
  },

  getEventContentBySlug: async (req, res) => {
    try {
      const { slug } = req.params;
      //! nanti diganti dengan req.user => ganti req.params dengan req.user dan hapus params di ROUTES dan POSTMAN
      const { userId } = req.params;

      const event = await EventContent.findOne({ slug }).select(
        '_id slug poster logo user title broadcast_media category description',
        'start_event end_event tags price organizer_name no_hp ',
        'organizer_email poster logo image_1 image_2 image_3 image_4',
        'deadline date_start_event date_end_event',
      ).lean();

      if (!event) {
        const error = new Error('Event Doesnt Exist');
        error.errorStatus = 404;
        throw error;
      }

      if (userId) { // jika ditemukan user
        const archieve_event = await ArchiveEvent.findOne({ user: userId, scholarship: event._id });
        if (archieve_event) { // jika user sudah menyimpan arsip
          event.is_saved = true;
          event.is_login = true;
          event.trigger_id = archieve_event._id;
        } else { // jika user belum menyimpan arsip
          event.is_saved = false;
          event.is_login = true;
          event.trigger_id = event._id;
        }
      } else { // jika tidak ditemukan user
        event.is_saved = false;
        event.is_login = false;
        event.trigger_id = false;
      }

      res.status(200).json({ status: 200, message: 'Success Get One Event', result: event });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error });
    }
  },

};
