const db = require("./connection");
const format = require("pg-format");
const { createUserRef, createPropertyRef } = require("./utils");


async function seed(usersData, propertyTypesData, propertiesData, reviewsData) {

    // drop all tables (in reverse order, children tables first)

    await db.query(`DROP TABLE IF EXISTS reviews;`);
    await db.query(`DROP TABLE IF EXISTS images;`); 
    await db.query(`DROP TABLE IF EXISTS properties;`);
    await db.query(`DROP TABLE IF EXISTS property_types;`);
    await db.query(`DROP TABLE IF EXISTS users;`);
    
  
    // create tables

    // users table

    await db.query(`CREATE TABLE users (
                    user_id SERIAL PRIMARY KEY,
                    first_name VARCHAR(40) NOT NULL,
                    surname VARCHAR(40) NOT NULL,
                    email VARCHAR(320) NOT NULL,
                    phone_number VARCHAR(20),
                    is_host BOOLEAN NOT NULL,
                    avatar VARCHAR,
                    created_at TIMESTAMP DEFAULT NOW()
            );
       `);
       console.log("Created users table");

    // property_types table
    await db.query(`CREATE TABLE property_types (
                    property_type VARCHAR PRIMARY KEY,
                    description TEXT NOT NULL
            );
        `);
    console.log("Created property_types table");

    // properties table
    await db.query(`CREATE TABLE properties (
                    property_id SERIAL PRIMARY KEY,
                    host_id INT NOT NULL REFERENCES users(user_id),
                    name VARCHAR NOT NULL,
                    location VARCHAR NOT NULL,
                    property_type VARCHAR NOT NULL REFERENCES property_types(property_type),
                    price_per_night INT NOT NULL,
                    description TEXT
            );
        `);
    console.log("Created properties table");

    // reviews table
    await db.query(`CREATE TABLE reviews (
                    review_id SERIAL PRIMARY KEY,
                    property_id INT NOT NULL REFERENCES properties(property_id),
                    guest_id INT NOT NULL REFERENCES users(user_id),
                    rating INT NOT NULL,
                    comment TEXT,
                    created_at TIMESTAMP DEFAULT NOW()
        );
    `);
    console.log("Created reviews table");

    // Insert data into tables 

    // Users 
    const insertUsers = format(
    `INSERT INTO users (first_name, surname, email, phone_number, is_host, avatar) VALUES %L RETURNING *`,
    usersData.map(user => [user.first_name, user.surname, user.email, user.phone_number, user.is_host, user.avatar])
  );
  const { rows: insertedUsers } = await db.query(insertUsers); // capture inserted users for mapping
  console.log("Inserted users data");

    const userRef = createUserRef(insertedUsers);
    // this is to make a number (user_id) correspond to the user, i.e "Alice Johnson": 1


    // Property_types 
    const insertTypes = format(
    `INSERT INTO property_types (property_type, description) VALUES %L`,
    propertyTypesData.map(({ property_type, description }) => 
        [property_type, description])
  );
    await db.query(insertTypes);
    console.log("Inserted property types data");


    // Properties 
   
     // (maping host_name to host_id using userRef)
    const formattedProperties = propertiesData.map(({ name, location, property_type, price_per_night, description, host_name }) => [
        userRef[host_name],  // host_id from mapping
        name,
        location,
        property_type,
        price_per_night,
        description
    ]);

    const insertProperties = format(
  `INSERT INTO properties (host_id, name, location, property_type, price_per_night, description) VALUES %L RETURNING *`,
  formattedProperties
  );
  const { rows: insertedProperties } = await db.query(insertProperties);
  console.log("Inserted properties data");

  const propertyRef = createPropertyRef(insertedProperties);

    // Reviews

     const formattedReviews = reviewsData
      .filter(review => userRef[review.guest_name] && propertyRef[review.property_name]) // only valid mappings
      .map(review => [
      propertyRef[review.property_name], // property_id from mapping
      userRef[review.guest_name],        // guest_id from mapping
      review.rating,
      review.comment
  ]);

    const insertReviews = format(
    `INSERT INTO reviews (property_id, guest_id, rating, comment) VALUES %L`,
    formattedReviews
  );
    await db.query(insertReviews);
    console.log("Inserted reviews data");

};


module.exports = seed;