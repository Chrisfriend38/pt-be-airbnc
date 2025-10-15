const express = require("express");
const { getProperties } = require("./server/controllers/properties");
const { handlePathNotFound, handleServerErrors } = require("./errors");

const app = express();
app.use(express.json());


app.get("/api/properties", getProperties);

app.use(handlePathNotFound);
app.use(handleServerErrors);

module.exports = app;