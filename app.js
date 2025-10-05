const express = require("express");
const { getPropertyTypes } = require("./db/controllers/properties");
const { handlePathNotFound, handleBadRequests, handleServerErrors } = require("./errors");

const app = express();
app.use(express.json());

app.get("/api/properties", getPropertyTypes);


app.use(handlePathNotFound);
app.use(handleBadRequests);
app.use(handleServerErrors);

module.exports = app;