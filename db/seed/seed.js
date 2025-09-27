const db = require("../connection");
const dropTables = require("./drops");
const createTables = require("./createTables");
const { insertUsers, insertPropertyTypes, insertProperties, insertReviews, insertImages } = require("./insert");
const { createUserRef, createPropertyRef, createImagesRef } = require("../utils/utils");

async function seed(usersData, propertyTypesData, propertiesData, reviewsData, imagesData) {
  await dropTables();
  await createTables();

  const insertedUsers = await insertUsers(usersData);
  const userRef = createUserRef(insertedUsers);

  await insertPropertyTypes(propertyTypesData);

  const insertedProperties = await insertProperties(propertiesData, userRef);
  const propertyRef = createPropertyRef(insertedProperties);

  await insertReviews(reviewsData, userRef, propertyRef);
  await insertImages(imagesData, propertyRef);
}

module.exports = seed;