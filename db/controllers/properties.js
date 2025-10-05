const { getAllProperties } = require("../models/properties");

async function getPropertyTypes(req, res, next) {
  try {
    const { sort, order } = req.query;
    const properties = await getAllProperties(sort, order);
    res.status(200).json({ properties });
  } catch (err) {
    next(err);
  }
}

module.exports = { getPropertyTypes };