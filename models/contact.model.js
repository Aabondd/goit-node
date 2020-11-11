const mongoose = require('mongoose');
const {
  Schema,
  Types: { ObjectId },
} = mongoose;

const contactSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  subscription: { type: String, required: true },
  password: { type: String, required: true },
  token: { type: String, required: false, default: '' },
});

// Static methods
contactSchema.statics.findContactByIdAndUpdate = findContactByIdAndUpdate;
contactSchema.statics.findContactByEmail = findContactByEmail;

async function findContactByIdAndUpdate(userId, updateParams) {
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

async function findContactByEmail(email) {
  return this.findOne({ email });
}

const contactModel = mongoose.model('Contact', contactSchema);

module.exports = contactModel;
