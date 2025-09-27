# AirBNC

Project - Building an API for a property rental service 

# Setting up the local test database with a script 

We are using PostgresSQL to manage the test database

To create the database 'airbnc_test', run: 

psql -f db/airbnc_test.sql

# Create connection.js

This is used to set up the Postgres connection

The connection pool reads credentials from a .env file.

Create a .env file in the project root but make sure to add .env to .gitignore before commiting. 

