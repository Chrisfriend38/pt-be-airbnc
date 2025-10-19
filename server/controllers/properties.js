const { fetchProperties, fetchPropertyById } = require("../models/properties");

exports.getProperties = async (req, res, next) => {
    const { order } = req.query;

    const sortOrder = order === "descending" ? "DESC" : "ASC";

    if (order && order !== "ascending" && order !== "descending") {
      next({ status: 400, msg: "Bad Request" });
    }

    fetchProperties(sortOrder)
    .then((properties) => {
      res.status(200).send({ properties });
    })
    .catch((err) => {
      next(err);
    });
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
    next({ status: 400, msg: "Bad Request" });
  }

  fetchPropertyById(id)
  .then((property) => {
    if (property === undefined) {
      return next({ status: 404, msg: "Error: Property not found" });
    } else {
      res.status(200).send({ property });
    }  
  })
  .catch(next);
  };
