const mongoose = require('mongoose');
const {
  Schema,
  Types: { ObjectId },
} = mongoose;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatarURL: { type: String, required: false },
  status: {
    type: String,
    required: true,
    enum: ['Verified', 'Created'],
    default: 'Created',
  },
  verificationToken: { type: String, required: false },
  subscription: {
    type: String,
    enum: ['free', 'pro', 'premium'],
    default: 'free',
  },
  token: { type: String, required: false },
});

// Static methods
userSchema.statics.findUserByIdAndUpdate = findUserByIdAndUpdate;
userSchema.statics.findUserByEmail = findUserByEmail;
userSchema.statics.updateToken = updateToken;
userSchema.statics.createVarificationToken = createVarificationToken;
userSchema.statics.findByVerificationToken = findByVerificationToken;
userSchema.statics.verifyUser = verifyUser;

async function findUserByIdAndUpdate(userId, updateParams) {
  return this.findByIdAndUpdate(
    userId,
    {
      $set: updateParams,
    },
    {
      new: true,
    },
  );
}

async function findUserByEmail(email) {
  return this.findOne({ email });
}

async function updateToken(id, newToken) {
  return this.findByIdAndUpdate(id, {
    token: newToken,
  });
}

async function createVarificationToken(userId, verificationToken) {
  return this.findByIdAndUpdate(userId, { verificationToken }, { new: true });
}

async function findByVerificationToken(verificationToken) {
  return this.findOne({ verificationToken });
}

async function verifyUser(userId) {
  return this.findByIdAndUpdate(
    userId,
    { status: 'Verified', verificationToken: null },
    { new: true },
  );
}

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
