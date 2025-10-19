const db = require("../../db/connection");

exports.fetchProperties = (sortOrder = "ASC") => {
  const query = `SELECT * FROM properties ORDER BY price_per_night ${sortOrder};`;
  return db.query(query)
	.then(({ rows }) => rows);
};

exports.fetchPropertyById = (id) => {
	const query = `SELECT * FROM properties WHERE property_id = $1;`;
	return db.query(query, [id])
	.then(({ rows }) => rows[0]);
};