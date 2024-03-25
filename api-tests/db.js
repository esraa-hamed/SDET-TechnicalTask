const fs = require('fs');
const path = require('path');

const dbFilePath = path.join(__dirname, 'components', 'mock', 'users.json');

// Function to read data from the JSON file
function readUsersFromFile() {
  const rawData = fs.readFileSync(dbFilePath);
  const jsonData =JSON.parse(rawData);
  const users = jsonData.users;
  return users;
}

// Function to find a user by email in the JSON file
function findUserByEmail(email) {
  const users = readUsersFromFile();
  return users.find( (user) => user.email === email);
}

// Function to find a user by id in the JSON file
function findUserByID(id) {
  const users = readUsersFromFile();
  return users.find( (user) => user.id === id);
}

module.exports = {
  readUsersFromFile,
  findUserByEmail,
  findUserByID
};
