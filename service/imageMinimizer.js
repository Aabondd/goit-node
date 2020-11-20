const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');

const { createPathDestination } = require('./avatarConfig');

const imageMinimizer = async userId => {
  await imagemin(['tmp'], {
    destination: createPathDestination(),
    plugins: [
      imageminJpegtran(),
      imageminPngquant({
        quality: [0.6, 0.8],
      }),
    ],
  });
};

module.exports = {
  imageMinimizer,
};
