const { fetchProperties, fetchPropertyById } = require("../models/properties");

exports.getProperties = async (req, res, next) => {
  const { order, property_type } = req.query;
  const sortOrder = order === "descending" ? "DESC" : "ASC";

  if (order && order !== "ascending" && order !== "descending") {
    return res.status(400).send({ msg: "Bad Request" });
  }

  const maxPriceNumber = parseInt(req.query.maxprice);
  const minPriceNumber = parseInt(req.query.minprice);

  if (req.query.maxprice && maxPriceNumber.toString() !== req.query.maxprice) {
    return res.status(400).send({ msg: "Bad Request" });
  }

  if (req.query.minprice && minPriceNumber.toString() !== req.query.minprice) {
    return res.status(400).send({ msg: "Bad Request" });
  }

  try {
    const properties = await fetchProperties(sortOrder, maxPriceNumber, minPriceNumber, property_type);

    if (!properties || properties.length === 0) {
      return res.status(200).send({ properties: [] });
    }

    res.status(200).send({ properties });
  } catch (err) {
    next(err);
  }
};

exports.getPropertyById = async (req, res, next) => {
  const { id } = req.params;

  let isNumber = true;
  for (let i = 0; i < id.length; i++) {
    if (id[i] < "0" || id[i] > "9") {
      isNumber = false;
    }
  }

  if (!isNumber) {
    return res.status(400).send({ msg: "Bad Request" });
  }

  try {
    const property = await fetchPropertyById(id);

    if (!property) {
      return res.status(404).send({ msg: "Error: Property not found" });
    }

    res.status(200).send({ property });
  } catch (err) {
    next(err);
  }
};