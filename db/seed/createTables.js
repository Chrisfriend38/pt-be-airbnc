const db = require("../connection");

async function createTables() {
  await db.query(`
    CREATE TABLE users (
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

  await db.query(`
    CREATE TABLE property_types (
      property_type VARCHAR PRIMARY KEY,
      description TEXT NOT NULL
    );
  `);

  await db.query(`
    CREATE TABLE properties (
      property_id SERIAL PRIMARY KEY,
      host_id INT NOT NULL REFERENCES users(user_id),
      name VARCHAR NOT NULL,
      location VARCHAR NOT NULL,
      property_type VARCHAR NOT NULL REFERENCES property_types(property_type),
      price_per_night INT NOT NULL,
      description TEXT
    );
  `);

  await db.query(`
    CREATE TABLE reviews (
      review_id SERIAL PRIMARY KEY,
      property_id INT NOT NULL REFERENCES properties(property_id),
      guest_id INT NOT NULL REFERENCES users(user_id),
      rating INT NOT NULL,
      comment TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await db.query(`
    CREATE TABLE images (
      image_id SERIAL PRIMARY KEY,
      property_id INT REFERENCES properties(property_id),
      image_url VARCHAR NOT NULL,
      alt_text VARCHAR NOT NULL
    );
  `);

  await db.query(`
  CREATE TABLE favourites (
    favourite_id SERIAL PRIMARY KEY,
    guest_id INT NOT NULL REFERENCES users(user_id),
    property_id INT NOT NULL REFERENCES properties(property_id),
    created_at TIMESTAMP DEFAULT NOW()
    );
  `);
}

module.exports = createTables;
