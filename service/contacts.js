const fs = require('fs');
const path = require('path');
const { getMaxListeners } = require('process');
const { stringify } = require('querystring');
const contactsPath = path.join(__dirname, '../db/contacts.json');
const NotFoundError = require('../errors/NotFoundError');

// TODO: задокументировать каждую функцию
function listContacts() {
  const fullListOfContacts = fs.readFileSync(contactsPath, 'utf-8');
  const parsedContacts = JSON.parse(fullListOfContacts);
  return console.table(parsedContacts);
}

function getContactById(contactId) {
  const contacts = fs.readFileSync(contactsPath, 'utf-8');
  const parsedContacts = JSON.parse(contacts);
  const contactById = parsedContacts.find(
    contact => Number(contact.id) === Number(contactId),
  );

  if (!contactById) {
    // throw new NotFoundError();
    return 'User is not found';
  }

  console.table(contactById);
  return contactById;
}

function removeContact(contactId, res) {
  const contacts = fs.readFileSync(contactsPath, 'utf-8');
  const parsedContacts = JSON.parse(contacts);
  const contactById = parsedContacts.find(
    contact => Number(contact.id) === Number(contactId),
  );

  if (!contactById) {
    return res.status(404).json({ message: 'Not found' });
  }

  const updatedContactList = parsedContacts.filter(
    contact => contact.id !== contactId,
  );

  fs.writeFileSync(
    contactsPath,
    JSON.stringify(updatedContactList, null, 2),
    err => {
      if (err) throw err;
      console.log('Finished writing');
      console.log(`Contact with id: ${contactId} was deleted`);
    },
  );

  const updatedContacts = fs.readFileSync(contactsPath, 'utf-8');
  console.table(JSON.parse(updatedContacts));
  return updatedContacts;
}

function updateContact(req, res, contactId) {
  const contacts = fs.readFileSync(contactsPath, 'utf-8');
  const parsedContacts = JSON.parse(contacts);
  const contactById = parsedContacts.find(
    contact => Number(contact.id) === Number(contactId),
  );

  if (!contactById) {
    return res.status(404).json({ message: 'Not found' });
  }

  const targetContactIndex = parsedContacts.findIndex(
    contact => contact.id === contactId,
  );
  if (targetContactIndex === -1) {
    throw new NotFoundError('User not found');
  }

  const updatedContact = {
    ...parsedContacts[targetContactIndex],
    ...req.body,
  };
  parsedContacts[targetContactIndex] = updatedContact;

  fs.writeFileSync(
    contactsPath,
    JSON.stringify(parsedContacts, null, 2),
    err => {
      if (err) throw err;
      console.log('Finished writing');
      console.log(`Contact with id: ${contactId} was deleted`);
    },
  );

  const updatedContacts = fs.readFileSync(contactsPath, 'utf-8');
  console.table(JSON.parse(updatedContacts));

  return updatedContact;
}

function addContact(name, email, phone) {
  const contacts = fs.readFileSync(contactsPath, 'utf-8');
  const parsedContacts = JSON.parse(contacts);
  const newContact = { id: parsedContacts.length + 1, name, email, phone };
  parsedContacts.push(newContact);

  fs.writeFileSync(
    contactsPath,
    JSON.stringify(parsedContacts, null, 2),
    err => {
      if (err) throw err;
      console.log('There is an error');
      console.log('New user add to the contact list', newContact);
    },
  );

  console.table(parsedContacts);
  return newContact;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
