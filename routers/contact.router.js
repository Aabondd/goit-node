const { Router } = require('express');
const ContactController = require('../controllers/contact.controller');

const router = Router();

router.get('/', ContactController.getContacts);
router.get(
  '/:contactId',
  ContactController.validateId,
  ContactController.getById,
);

router.post(
  '/',
  ContactController.validateAddContact,
  ContactController.addContact,
);

router.delete(
  '/:contactId',
  ContactController.validateId,
  ContactController.deleteContact,
);

router.patch(
  '/:contactId',
  ContactController.validateId,
  ContactController.validateUpdateContact,
  ContactController.updateContact,
);

module.exports = router;
