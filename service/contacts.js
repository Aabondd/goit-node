const fs = require('fs');
const path = require('path');
const { getMaxListeners } = require('process');
const { stringify } = require('querystring');
const contactsPath = path.join(__dirname, '../db/contacts.json');
const NotFoundError = require('../errors/NotFoundError');

function listContacts() {
  fs.readFile(contactsPath, 'utf-8', (error, data) => {
    if (error) {
      return console.log(error);
    }

    const contacts = JSON.parse(data);
    console.table(contacts);
    return contacts;
  });
}

function getContactById(contactId) {
  fs.readFile(contactsPath, 'utf-8', (error, data) => {
    if (error) {
      return console.log(error);
    }

    const contacts = JSON.parse(data);

    const contact = contacts.find(contact => {
      if (contact.id === contactId) {
        console.log(`Get contact by ID ${contactId}:`);
        console.table(contact);
        return contact;
      }
    });

    if (contact == null) {
      console.log('User is not found');
    }
  });
}

function removeContact(contactId) {
  fs.readFile(contactsPath, 'utf-8', (error, data) => {
    if (error) {
      return console.log(error);
    }

    const contacts = JSON.parse(data);
    const newContact = contacts.filter(contact => contact.id !== contactId);

    if (newContact.length === contacts.length) {
      console.log(
        `Contact with ID "${contactId}" don't removed! ID "${contactId}" not found!`,
      );
      return;
    }

    console.log('Contact deleted successfully! New list of contacts: ');
    console.table(newContact);

    fs.writeFile(contactsPath, JSON.stringify(newContact, null, 2), error => {
      if (error) {
        return console.log('error :', error);
      }
    });
  });
}

function addContact(name, email, phone) {
  fs.readFile(contactsPath, 'utf-8', (error, data) => {
    if (error) {
      return console.log(error);
    }

    const contacts = JSON.parse(data);

    contacts.push({
      id: contacts.length + 1,
      name: name,
      email: email,
      phone: phone,
    });

    console.log('Contacts added successfully! New lists of contacts: ');
    console.table(contacts);

    fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), error => {
      if (error) {
        return console.log(error);
      }
    });
  });
}

function updateContact(req, res, contactId) {
  fs.readFile(contactsPath, 'utf-8', (error, data) => {
    if (error) {
      return console.log(error);
    }

    const contacts = JSON.parse(data);

    const contact = contacts.find(contact => {
      if (contact.id === contactId) {
        console.log(`Get contact by ID ${contactId}:`);
        console.table(contact);
        return contact;
      }
    });

    if (contact == null) {
      console.log(`Contact with ID "${contactId}" not found!`);
    }

    const targetContactIndex = contacts.findIndex(
      contact => contact.id === contactId,
    );
    if (targetContactIndex === -1) {
      throw new NotFoundError('User not found');
    }
    const updatedContact = {
      ...contacts[targetContactIndex],
      ...req.body,
    };

    contacts[targetContactIndex] = updatedContact;

    fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), error => {
      if (error) {
        return console.log(error);
      }
    });
  });
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
