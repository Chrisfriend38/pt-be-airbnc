const db = require("./connection");
const seed = require("./seed");
const { usersData, propertyTypesData } = require("./data/test");

// Run the seed for Property Types
seed(usersData, propertyTypesData)
  .then(() => {
    db.end(); 
  });