const cloudinary = require('../utils/cloudinary');
const EventContent = require('../models/EventContent');

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

  // getFiveLastestEvent: async (req, res) => {
  //   try {
  //     const eventContents = await EventContent.find().select(
  //       'title imageUrl date_start_event description slug _id tags category',
  //     ).limit(5).sort({ created_at: 'desc' });
  //     if (!eventContents) {
  //       res.status(404).json({
  //         status: 404,
  //         message: "Event Doesn't Exist ",
  //       });
  //     }

  //     res.status(200).json({
  //       status: 200,
  //       message: 'Succes Get 5 Latest Event',
  //       result: eventContents,
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: error });
  //   }
  // },

  // getOneEventBySlug: async (req, res) => {
  //   try {
  //     const { slug } = req.params;
  //     //! nanti diganti dengan req.user => ganti req.params dengan req.user dan hapus params di ROUTES dan POSTMAN
  //     const { userId } = req.params;
  //     const scholarship = await EventContent.findOne({ slug }).select(
  //       '_id slug event category date_start_event date_end_event start_event end_event organizer_name no_hp organizer_email broadcast_media imagesUrl tags price  description ',
  //     ).lean(); // .lean() berfungsi agar document scholarship bisa ditambahkan key value baru (menambahkan element baru) dan mempercepat kinerja find
  //     if (userId) { // jika ditemukan user
  //       const archieve_event = await ArchiveEvent.findOne({ user: userId, event: Event._id });
  //       if (archieve_event) { // jika user sudah menyimpan arsip
  //         event.is_saved = true;
  //         event.is_login = true;
  //         event.trigger_id = archieve_event._id;
  //       } else { // jika user belum menyimpan arsip
  //         event.is_saved = false;
  //         event.is_login = true;
  //         event.trigger_id = Event._id;
  //       }
  //     } else { // jika tidak ditemukan user
  //       event.is_saved = false;
  //       event.is_login = false;
  //       event.trigger_id = false;
  //     }
  //     res.status(200).json({ status: 200, message: 'Success Get One Event', result: scholarship });
  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).json({ message: err });
  //   }
  // },

};
