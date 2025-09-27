# AirBNC

Project - Building an API for a property rental service 

# Setting up the local test database with a script 

We are using PostgresSQL to manage the test database

To create the database 'airbnc_test', run: 

psql -f db/airbnc_test.sql

# Create connection.js

This is used to set up the Postgres connection

* The connection pool reads credentials from a .env file.
* Create a .env file in the project root but make sure to add .env to .gitignore before commiting. 
* npm install pg to allow Node to connect to Postgres 
* npm install dotenv to load environment variables from a .env file

# Set up the Seed Function

This script handles a bunch of data and puts it in a database for us

* Tables are dropped in reverse dependancy order, i.e child tables are dropped before parent tables to avoid any errors
* In the terminal write - npm run seed to run the database 
* This Seed uses pg-format to safely format SQL queries for bulk inserts. Make sure dependencies are installed using npm install pg-format 

# Set up the Seed-run Function

This scripts executes the seed function, allows the functions to run when data is populated

To run the script in terminal: npm run seed 

# Set up Property Type Table (Drop / Create / Insert)

* Drop Property Type Table (if exists)
* Create the table with property_type as the primary key
* Stores property types (Apartment, House, Studio etc...)
* Insert the data from property_types.json so the database is seeded with the intial database

# Set up Users Table (Drop / Create / Insert)

* Drop Users Table (if exists)
* Create the table with Users_id as the primary key
* Stores user information such as first name, surname, email, phone number etc.. 
* Foreigns Keys (FK) are used to connect to other tables
* Insert the data from users.JSON into the table so the database is seeded with the initial database 
