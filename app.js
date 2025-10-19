const express = require("express");
const { getProperties, getPropertyById } = require("./server/controllers/properties");
const { handlePathNotFound, handleServerErrors, handleCustomErrors } = require("./errors");

const app = express();
app.use(express.json());


app.get("/api/properties", getProperties);
app.get("/api/properties/:id", getPropertyById);

app.use(handlePathNotFound);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;