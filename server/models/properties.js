const db = require("../../db/connection");

exports.fetchProperties = async () => {
  const query = `SELECT * FROM properties;`;
  const { rows } = await db.query(query);
  return rows;
};