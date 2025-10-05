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
* Insert the data from property_types.json into the table so the database is seeded with the intial database

# Set up Users Table (Drop / Create / Insert)

* Drop Users Table (if exists)
* Create the table with Users_id as the primary key
* Stores user information such as first name, surname, email, phone number etc.. 
* Foreigns Keys (FK) are used to connect to other tables
* Insert the data from users.JSON into the table so the database is seeded with the initial database 

# Set up Reviews Table (Drop / Create / Insert)

* Drop Reviews Table
* Create the table with reviews_id as the primary key
* Foreign Key References properties via property_id
* Foreign Key References users via user_id 
* Insert the data from reviews.json into the table so the database is seeded with the inital database


# Set up Properties Table (Drop / Create / Insert)

* Drop Properties Table
* Create the table with property_id as the primary key 
* Foreign Key References users via host_id
* Insert the data from properties.json into the table so the database is seeded with the intial database

# Utills & Data Mapping 

* Create a utils.js file to handle object creation for mapping the IDs
* CreateUserRef maps user's full name (first_name + surname to their user_id)
* CreatePropertyRef maps property's name to it's property_id
* Replacement of names in seed data with correct foreign key IDs from the database
* Create a utils.test.js file. Following TDD practises using Jest. Utils function allows correct behaviour of seeding process.


# Set up Images Table (Drop / Create / Insert)

* Drop Images Table 
* Create the table with images_id as the primary key
* Foreign Key References properties via property_id
* Insert the data from images.json into the table so the database is seeded with the inital database

# Utills & Data Mapping (Extended)

* createImagesRef maps images.property_name to property_id using propertyRef square brackets property_id

# Tidying up the Seed Function

* Create a Seed folder
* Split seed.js into seperate JS files for Drops (dropping tables), Insert (inserting data) and Creating Tables
* Link these modules to the Seed.js function
* Improving Visibility / Navigation within the db folder

# Tidying up the Utils Function

* Create a Utils folder
* Insert Uitls file inside utils folder and make sure it is linked correctly to utils.test.js 
* Improving Visibility / Navigation within the db folder

# Create the following endpoint GET/api/properties

* Create the endpoint 
* Include Sad and Happy Paths 404 / 200 for integration testing
* Default behavior: Properties returned are ordered by most favourites to least.




