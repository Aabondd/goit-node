const contacts = require('../db/contacts.json');
const Joi = require('joi');
const NotFoundError = require('../errors/NotFoundError');
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require('../service/contacts');

class ContactController {
  get deleteContact() {
    return this._deleteContact.bind(this);
  }

  getContacts(req, res) {
    listContacts();
    res.status(200).json(contacts);
  }

  getById(req, res) {
    const { contactId } = req.params;

    const userId = parseInt(contactId);

    const contactById = getContactById(userId);

    if (contactById === 'User is not found') {
      return res.status(404).json({ message: 'Not found' });
    }

    return res.json(contactById);
  }

  addContact(req, res) {
    const { name, email, phone } = req.body;
    const newContact = addContact(name, email, phone);
    return res.status(201).json(newContact);
  }

  validateAddContact(req, res, next) {
    const validationRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
    });

    const validationResult = validationRules.validate(req.body);

    if (validationResult.error) {
      return res.status(400).json({ message: 'missing required name field' });
    }

    next();
  }

  validateUpdateContact(req, res, next) {
    const validationRules = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
    }).or('name', 'email', 'phone');

    const validationResult = validationRules.validate(req.body);

    if (validationResult.error) {
      return res.status(400).json({ message: 'missing fields' });
    }

    next();
  }

  updateContact(req, res) {
    const { contactId } = req.params;
    const userId = +contactId;

    const contactUpdatedResult = updateContact(req, res, userId);

    return res.status(200).json(contactUpdatedResult);
  }

  _deleteContact(req, res) {
    const { contactId } = req.params;
    const userId = parseInt(contactId);

    removeContact(userId, res);

    res.status(200).json({ message: 'contact deleted' });
  }

  findUserIndex(userId) {
    const targetContactIndex = contacts.findIndex(
      contact => contact.id === userId,
    );
    if (targetContactIndex === -1) {
      throw new NotFoundError('User not found');
    }

    return targetContactIndex;
  }
}

module.exports = new ContactController();
