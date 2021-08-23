const cloudinary = require('../utils/cloudinary');
const EventContent = require('../models/EventContent');
const ArchiveEvent = require('../models/ArchiveEvent');
const EventOwner = require('../models/EventOwner');

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

      const user = req.user._id;

      const {
        title,
        broadcast_media,
        numberOfTicket,
        registration_link,
        category,
        deadline,
        description,
        date_start_event,
        date_end_event,
        start_event,
        end_event,
        tags,
        price,
        no_hp,
        organizer_name,
        organizer_email,
        no_rekening,
        user_bank,
        name_bank,
      } = req.body;
      const newEventContent = new EventContent({
        user,
        title,
        registration_link,
        broadcast_media,
        category,
        deadline,
        numberOfTicket,
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
        user_bank,
        no_rekening,
        name_bank,
      });

      // untuk nampung jika terjadi error
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
        return res.status(409).json({ message: 'The same event has been uploaded' });
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
        '_id title poster deadline description slug tags category',
      ).skip(5).sort({ createdAt: 'desc' });

      if (events.length < 1 && events !== null) {
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
        '_id title poster deadline description slug tags category',
      ).limit(5).sort({ createdAt: 'desc' });

      if (events.length < 1 && events !== null) {
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

      console.log(slug);

      const userId = req.user._id;

      const event = await EventContent.findOne({ slug }).select(
        ' _id slug poster logo user title broadcast_media category description start_event end_event image_1 image_2 image_3 image_4 deadline date_start_event date_end_event registration_link numberOfTicket',
      ).lean();

      if (event !== null && event.length < 1) {
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

        const error = new Error('User Doesnt Exist');
        error.errorStatus = 404;
        throw error;
      }

      res.status(200).json({ status: 200, message: 'Success Get One Event by slug', result: event });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error });
    }
  },

  // ini untuk di button semua gratis berbayar
  getEventContentByTags: async (req, res) => {
    try {
      const { tags } = req.params;
      const events = await EventContent.find({ tags }).select(
        '_id title poster deadline description slug tags',
      );

      if (events !== null && events.length < 1) {
        const error = new Error('Event Doesnt Exist');
        error.errorStatus = 404;
        throw error;
      }

      res.status(200).json({
        status: 200,
        message: 'Success Get All Events by Tags',
        result: events,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error });
    }
  },

  getEventContentBySlugConfirm: async (req, res) => {
    try {
      const { slug } = req.params;

      const event = await EventContent.findOne({ slug }).select(
        ' _id slug poster logo user title broadcast_media start_event end_event price organizer_name no_hp organizer_email deadline date_start_event date_end_event registration_link numberOfTicket',
      );

      if (event.length < 1 && event !== null) {
        const error = new Error('Event Doesnt Exist');
        error.errorStatus = 404;
        throw error;
      }

      res.status(200).json({ status: 200, message: 'Success Get One Event for Payment', result: event });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error });
    }
  },

  getEventContentByTitle: async (req, res) => {
    try {
      const { title } = req.query;
      const events = await EventContent.find({ title: new RegExp(title, 'i') }).select(
        '_id title poster deadline description slug tags',
      );
      if (events.length > 0) {
        res.status(200).json({
          status: 200,
          message: 'Success Get Search Events',
          result: events,
        });
      } else {
        res.status(404).json({
          status: 404,
          message: 'Event Not Found',
          result: events,
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err });
    }
  },

  getEventContentByTitleWithSearching: async (req, res) => {
    try {
      const { title } = req.query;
      const events = await EventContent.find({ title: new RegExp(title, 'i') }).select(
        '_id title poster deadline description slug tags',
      );
      if (events.length > 0) {
        res.status(200).json({
          status: 200,
          message: 'Success Get Search Events',
          result: events,
        });
      } else {
        res.status(404).json({
          status: 404,
          message: 'Events Not Found',
          result: events,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error });
    }
  },

  createCheckoutEvent: async (req, res) => {
    try {
      const { slug } = req.params;
      const user = req.user._id;
      const event = await EventContent.findOne({ slug }).select('_id');
      const newOwner = new EventOwner({
        user,
        event: event._id,
      });
      const savedOwner = await newOwner.save();
      res.status(201).json({
        status: 201,
        message: 'Success Purchase The Course',
        result: savedOwner,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err });
    }
  },

};
