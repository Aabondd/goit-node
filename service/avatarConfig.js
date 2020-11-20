const PORT = process.env.PORT || 3000;

const createPathDestination = () => 'public/images';
const createPathDraft = userId => `./tmp/${userId}.png`;
const createFullPathDraft = (userID, fileFormat) =>
  `tmp/${userID}.${fileFormat}`;

const createFullPathToMinifiedImg = (userID, fileFormat) =>
  `localhost:${PORT}/images/${userID}.${fileFormat}`;

const createPathToAvatar = filename => `localhost:${PORT}/images/${filename}`;

const createPathToDefaultAvatar = () => '../public/images/default_avatar.png';

module.exports = {
  createPathDestination,
  createPathDraft,
  createFullPathDraft,
  createFullPathToMinifiedImg,
  createPathToAvatar,
  createPathToDefaultAvatar,
};
