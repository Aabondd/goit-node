const express = require('express');
const ContactController = require('../controllers/contact.controller');

const router = express.Router();

router.get('/', ContactController.getContacts);
router.get('/:contactId', ContactController.getById);
router.post(
  '/',
  ContactController.validateAddContact,
  ContactController.addContact,
);
router.delete('/:contactId', ContactController.deleteContact);
router.patch(
  '/:contactId',
  ContactController.validateUpdateContact,
  ContactController.updateContact,
);

module.exports = router;
