const db = require("../connection");
const format = require("pg-format");
const { createUserRef, createPropertyRef, createImagesRef } = require("../utils/utils");

async function insertUsers(usersData) {
  if (!usersData || usersData.length === 0) {
      return []
  };

  const query = format(
    `INSERT INTO users (first_name, surname, email, phone_number, is_host, avatar) VALUES %L RETURNING *`,
    usersData.map(u => [u.first_name, u.surname, u.email, u.phone_number, u.is_host, u.avatar])
  );

  const { rows } = await db.query(query);
  return rows;
}

async function insertPropertyTypes(propertyTypesData) {
  if (!propertyTypesData || propertyTypesData.length === 0) {
      return []
  };

  const query = format(
    `INSERT INTO property_types (property_type, description) VALUES %L`,
    propertyTypesData.map(pt => [pt.property_type, pt.description])
  );

  await db.query(query);
}

async function insertProperties(propertiesData, userRef) {
  if (!propertiesData || propertiesData.length === 0) {
      return []
  };

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
  return rows;
}

async function insertReviews(reviewsData, userRef, propertyRef) {
    if (!reviewsData || reviewsData.length === 0) {
      return []
    };

  const formatted = reviewsData
    .filter(r => userRef[r.guest_name] && propertyRef[r.property_name])
    .map(r => [propertyRef[r.property_name], userRef[r.guest_name], r.rating, r.comment]);

    if (formatted.length === 0) {
      return [];
    }
  
  const query = format(
    `INSERT INTO reviews (property_id, guest_id, rating, comment) VALUES %L`,
    formatted
  );

  await db.query(query);
}

async function insertImages(imagesData, propertyRef) {
  if (!imagesData || imagesData.length === 0) {
    return [];
  };

  const formatted = imagesData.map(({ property_name, image_url, alt_tag }) => [
    propertyRef[property_name],
    image_url,
    alt_tag
  ]);

  if (formatted.length === 0) {
      return [];
  }

  const query = format(
    `INSERT INTO images (property_id, image_url, alt_text) VALUES %L`,
    formatted
  );
  await db.query(query);
}

async function insertFavourites(favouritesData, userRef, propertyRef) {
  if (!favouritesData.length) {
    return []
  };

    const formatted = favouritesData.map(({ guest_name, property_name }) => [
    userRef[guest_name],
    propertyRef[property_name],
  ]);

    const query = format(
    `INSERT INTO favourites (guest_id, property_id) VALUES %L RETURNING *;`,
    formatted
  );

  const { rows } = await db.query(query);
  // console.log("Inserted favourites data");
  return rows;
}





module.exports = { insertUsers, insertPropertyTypes, insertProperties, insertReviews, insertImages, insertFavourites };
