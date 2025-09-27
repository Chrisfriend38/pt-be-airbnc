const db = require("./connection");
const seed = require("./seed");
const { usersData, propertyTypesData, propertiesData, reviewsData } = require("./data/test");

// Run the seed for all types
seed(usersData, propertyTypesData, propertiesData, reviewsData)
  .then(() => {
    db.end(); 
  });