const db = require("../../db/connection");

exports.fetchProperties = async (sortOrder = "ASC", maxPrice, minPrice, property_type) => {
  let query;
  let queryParams = [];

  if (property_type) {
    query = `
      SELECT * FROM properties
      WHERE property_type = $1
      ORDER BY price_per_night ${sortOrder};
    `;
    queryParams.push(property_type);
  } 

  else if (maxPrice && minPrice) {
    query = `
      SELECT * FROM properties
      WHERE price_per_night BETWEEN $1 AND $2
      ORDER BY price_per_night ${sortOrder};
    `;
    queryParams.push(minPrice, maxPrice);
  } 
  
  else if (maxPrice) {
    query = `
      SELECT * FROM properties
      WHERE price_per_night <= $1
      ORDER BY price_per_night ${sortOrder};
    `;
    queryParams.push(maxPrice);
  } 
  
  else if (minPrice) {
    query = `
      SELECT * FROM properties
      WHERE price_per_night >= $1
      ORDER BY price_per_night ${sortOrder};
    `;
    queryParams.push(minPrice);
  } 

  else {
    query = `
      SELECT * FROM properties
      ORDER BY price_per_night ${sortOrder};
    `;
  }

  const { rows } = await db.query(query, queryParams);
  return rows;
};

exports.fetchPropertyById = async (id) => {
  const query = `
    SELECT * FROM properties WHERE property_id = $1;
  `;
  const { rows } = await db.query(query, [id]);
  return rows[0];
};

exports.fetchPropertiesByType = async (type) => {
  const query = `
    SELECT * FROM properties WHERE property_type = $1;
  `;
  const result = await db.query(query, [type]);
  return result.rows;
};