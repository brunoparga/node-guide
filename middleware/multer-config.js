const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => cb(null,
  ['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype));

module.exports = multer({ storage, fileFilter }).single('image');
