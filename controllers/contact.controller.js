const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const {
  Types: { ObjectId },
} = require('mongoose');

const contactModel = require('../models/contact.model');

class ContactController {
  constructor() {
    this._costFactor = 4;
  }

  async getContacts(req, res, next) {
    try {
      const contacts = await contactModel.find();
      return res.status(200).json(contacts);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const id = req.params.contactId;

      const contact = await contactModel.findById(id);
      if (!contact) {
        return res.status(404).json({ message: 'Not found' });
      }

      return res.status(200).json(contact);
    } catch (err) {
      next(err);
    }
  }

  async addContact(req, res, next) {
    try {
      const { name, email, phone, subscription, password, token } = req.body;

      const newContact = await contactModel.create({
        name,
        email,
        phone,
        subscription,
        password,
        token,
      });

      return res.status(201).json(newContact);
    } catch (err) {
      next(err);
    }
  }

  async deleteContact(req, res, next) {
    try {
      const id = req.params.contactId;

      const deletedContact = await contactModel.findByIdAndDelete(id);
      if (!deletedContact) {
        return res.status(404).send();
      }

      res.status(200).json({ message: 'contact deleted' });
    } catch (err) {
      next(err);
    }
  }

  async updateContact(req, res, next) {
    try {
      const id = req.params.contactId;

      const contactToUpdate = await contactModel.findContactByIdAndUpdate(
        id,
        req.body,
      );

      if (!contactToUpdate) {
        return res.status(404).send();
      }

      return res.status(200).json(contactToUpdate);
    } catch (err) {
      next(err);
    }
  }

  validateId(req, res, next) {
    const { contactId } = req.params;

    if (!ObjectId.isValid(contactId)) {
      return res.status(400).send();
    }

    next();
  }

  async validateAddContact(req, res, next) {
    const validationRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),

      subscription: Joi.string().required(),
      password: Joi.string().required(),
      token: Joi.string(),
    });

    const validationResult = Joi.validate(req.body, validationRules);
    if (validationResult.error) {
      return res.status(400).send(validationResult.error);
    }

    try {
      const { email } = req.body;

      const existingContact = await contactModel.findContactByEmail(email);
      if (existingContact) {
        return res.status(409).send('Contact with such email already exists');
      }
    } catch (err) {
      next(err);
    }

    next();
  }

  validateUpdateContact(req, res, next) {
    const validationRules = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
      subscription: Joi.string(),
      password: Joi.string(),
      token: Joi.string(),
    });

    const validationResult = Joi.validate(req.body, validationRules);
    if (validationResult.error) {
      return res.status(400).send(validationResult.error);
    }

    next();
  }
}

module.exports = new ContactController();
