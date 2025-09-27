const db = require("../connection");
const format = require("pg-format");
const { createUserRef, createPropertyRef, createImagesRef } = require("../utils/utils");

async function insertUsers(usersData) {
  const query = format(
    `INSERT INTO users (first_name, surname, email, phone_number, is_host, avatar) VALUES %L RETURNING *`,
    usersData.map(u => [u.first_name, u.surname, u.email, u.phone_number, u.is_host, u.avatar])
  );
  const { rows } = await db.query(query);
  console.log("Inserted users data");
  return rows;
}

async function insertPropertyTypes(propertyTypesData) {
  const query = format(
    `INSERT INTO property_types (property_type, description) VALUES %L`,
    propertyTypesData.map(pt => [pt.property_type, pt.description])
  );
  await db.query(query);
  console.log("Inserted property types data");
}

async function insertProperties(propertiesData, userRef) {
  const formatted = propertiesData.map(({ name, location, property_type, price_per_night, description, host_name }) => [
    userRef[host_name],
    name,
    location,
    property_type,
    price_per_night,
    description
  ]);
  const query = format(
    `INSERT INTO properties (host_id, name, location, property_type, price_per_night, description) VALUES %L RETURNING *`,
    formatted
  );
  const { rows } = await db.query(query);
  console.log("Inserted properties data");
  return rows;
}

async function insertReviews(reviewsData, userRef, propertyRef) {
  const formatted = reviewsData
    .filter(r => userRef[r.guest_name] && propertyRef[r.property_name])
    .map(r => [propertyRef[r.property_name], userRef[r.guest_name], r.rating, r.comment]);
  
  const query = format(
    `INSERT INTO reviews (property_id, guest_id, rating, comment) VALUES %L`,
    formatted
  );
  await db.query(query);
  console.log("Inserted reviews data");
}

async function insertImages(imagesData, propertyRef) {
  const formatted = imagesData.map(({ property_name, image_url, alt_tag }) => [
    propertyRef[property_name],
    image_url,
    alt_tag
  ]);
  const query = format(
    `INSERT INTO images (property_id, image_url, alt_text) VALUES %L`,
    formatted
  );
  await db.query(query);
  console.log("Inserted images data");
}

module.exports = { insertUsers, insertPropertyTypes, insertProperties, insertReviews, insertImages };
