const db = require("../connection");

async function getAllProperties() {
  const query = `
    SELECT 
      p.property_id,
      p.name AS property_name,
      p.location,
      p.price_per_night,
      u.first_name || ' ' || u.surname AS host,
      COUNT(f.favourite_id) AS favourite_count
    FROM properties p
    JOIN users u ON p.host_id = u.user_id
    LEFT JOIN favourites f ON p.property_id = f.property_id
    GROUP BY p.property_id, u.first_name, u.surname
    ORDER BY favourite_count DESC;
  `;
  const { rows } = await db.query(query);
  return rows;
}

module.exports = { getAllProperties };