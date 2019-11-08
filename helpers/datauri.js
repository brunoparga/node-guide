const path = require('path');
const DataURI = require('datauri');

const dataURI = new DataURI();

module.exports = (req) => dataURI.format(
  path.extname(req.file.originalname).toString(), req.file.buffer,
);
