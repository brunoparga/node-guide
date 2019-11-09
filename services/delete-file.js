const { uploader: cloudinary } = require('cloudinary');

const findId = (imageURL) => {
  const regex = /[^/]\/(?<publicId>\w+)\.(png|jpg|jpeg)$/;
  return imageURL.match(regex).groups.publicId;
};

const deleteFile = (imageURL) => {
  const file = findId(imageURL);
  cloudinary.destroy(file, { invalidate: true }, () => { });
};

module.exports = deleteFile;
