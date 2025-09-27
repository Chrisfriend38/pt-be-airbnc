const db = require("./connection");
const format = require("pg-format");

async function seed(usersData, propertyTypesData) {

    // drop all tables (in reverse order, children tables first)

    await db.query(`DROP TABLE IF EXISTS property_types;`);
    console.log("Dropped property_types table")

    await db.query(`DROP TABLE IF EXISTS users;`);
    console.log("Dropped user table")

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
    await db.query(`
      CREATE TABLE property_types (
        property_type VARCHAR PRIMARY KEY,
        description TEXT NOT NULL
      );
    `);
    console.log("Created property_types table");

    // Insert data into tables

    // Users
    const insertUsers = format(
    `INSERT INTO users (first_name, surname, email, phone_number, is_host, avatar) VALUES %L`,
    usersData.map(({ first_name, surname, email, phone_number, is_host, avatar }) => 
      [first_name, surname, email, phone_number, is_host, avatar])
    );
    await db.query(insertUsers);
    console.log("Inserted users data")

    // Property_types
    const insertTypes = format(
      `INSERT INTO property_types (property_type, description) VALUES %L`,
      propertyTypesData.map(({ property_type, description }) => [property_type, description])
    );
    await db.query(insertTypes);
    console.log("Inserted property types data");


}

module.exports = seed;