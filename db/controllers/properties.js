const { getAllProperties } = require("../models/properties");

async function getPropertyTypes(req, res, next) {

  try {
    const properties = await getAllProperties();
    res.status(200).json({ properties });
  } catch (err) {
    next(err);
  }
}

module.exports = { getPropertyTypes };