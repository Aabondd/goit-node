const fs = require('fs');
const path = require('path');
const contactsPath = path.join(__dirname, 'db/contacts.json');

// TODO: задокументировать каждую функцию
function listContacts() {
  const fullListOfContacts = fs.readFileSync(contactsPath, 'utf-8');
  const parsedContacts = JSON.parse(fullListOfContacts);
  return console.table(parsedContacts);
}

module.exports = { listContacts };
