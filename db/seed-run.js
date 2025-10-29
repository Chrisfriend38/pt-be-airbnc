const db = require("./connection");
const seed = require("./seed/seed");
const { usersData, propertyTypesData, propertiesData, reviewsData, imagesData, favouritesData } = require("./data/test");

seed(usersData, propertyTypesData, propertiesData, reviewsData, imagesData, favouritesData)
  .then(() => {
    db.end(); 
  });