const fs = require("fs");
const path = require("path");
const { getMaxListeners } = require("process");




const contactsPath = path.join(
    __dirname,
    "db/contacts.json"
  );


  // TODO: задокументировать каждую функцию
function listContacts() {
    const fullListOfContacts = fs.readFileSync(contactsPath , "utf-8");
  
    return fullListOfContacts;
    }
  
  function getContactById(contactId) {

    const contacts = fs.readFileSync(contactsPath , "utf-8")
    const parsedContacts = JSON.parse(contacts)
    
    const contactById = parsedContacts.find(contact => Number(contact.id) === Number(contactId))

if (!contactById){ return "User is not found"} 

    return contactById }
  
  function removeContact(contactId) {
    const contacts = fs.readFileSync(contactsPath , "utf-8")
    const parsedContacts = JSON.parse(contacts)
    
    const contactById = parsedContacts.find(contact => Number(contact.id) === Number(contactId))

if (!contactById){ return console.log("User is not found");} 

   const updatedContactList = parsedContacts.filter((contact) => contact.id !== contactId); 

    fs.writeFileSync(contactsPath, JSON.stringify(updatedContactList, null, 2), (err) => { if (err) throw err;
    console.log("Finished writing");} )

    return console.log(`Contact with id: ${contactId} was deleted`);

  }
  
  function addContact(name, email, phone) {
    const contacts = fs.readFileSync(contactsPath , "utf-8")

    const parsedContacts = JSON.parse(contacts)

    newContactID = parsedContacts.length + 1

    const newContact = {"id": newContactID, name, email, phone}

    parsedContacts.push(newContact)

    fs.writeFileSync(contactsPath, JSON.stringify(parsedContacts, null, 2), (err) => { if (err) throw err;
        console.log("There is an error");} )

       return console.log("New user add to the contact list", newContact);
  }


  module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
  };


