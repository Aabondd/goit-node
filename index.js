const {
    listContacts,
    getContactById,
    removeContact,
    addContact,
  } = require('./contacts');

  const yargs = require("yargs");

  const argv = require('yargs').argv;

// TODO: рефакторить
function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case 'list':
       console.log(listContacts()); 
      break;

    case 'get':
       console.log(getContactById(id)); 
      break;

    case 'add':
        console.log(addContact(name, email, phone));
      break;

    case 'remove':
       console.log(removeContact(id));
      break;

    default:
      console.warn('\x1B[31m Unknown action type!');
  }
}

invokeAction(argv);
