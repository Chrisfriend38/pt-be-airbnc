const express = require("express");
const { getProperties, getPropertyById, getPropertiesByType } = require("./server/controllers/properties");
const { postReviewsForProperty, deleteReviewsForProperty, getReviewsForProperty } = require("./server/controllers/reviews");
const { getUserById } = require("./server/controllers/users");
const { handlePathNotFound, handleServerErrors, handleCustomErrors } = require("./errors");


const app = express();
app.use(express.json());


app.get("/api/properties", getProperties);
app.get("/api/properties/:id", getPropertyById);
app.get("/api/properties/:id/reviews", getReviewsForProperty);
app.post("/api/properties/:id/reviews", postReviewsForProperty);
app.delete("/api/properties/:id/reviews", deleteReviewsForProperty);
app.get("/api/users/:id", getUserById);



app.use(handlePathNotFound);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;