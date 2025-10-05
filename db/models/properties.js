const db = require("../connection");

// ?sort=<cost_per_night | popularity>

// ?order=<ascending | descending>

async function getAllProperties(sort = "popularity", order = "DESC") {
  const sortMapping = { 
    cost_per_night: "price_per_night", 
    popularity: "favourite_count" 
  };

  let sortOrder = "DESC";
  if (order.toLowerCase() === "ascending") {
    sortOrder = "ASC";
  };
  if (order.toLowerCase() === "descending") {
    sortOrder = "DESC";
  };

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
    LEFT OUTER JOIN favourites f ON p.property_id = f.property_id
    GROUP BY p.property_id, u.first_name, u.surname
    ORDER BY ${sortMapping[sort] || "favourite_count"} ${sortOrder};
  `;
  const { rows } = await db.query(query);
  return rows.map(row => ({
    ...row,
    price_per_night: Number(row.price_per_night),
    favourite_count: Number(row.favourite_count)
  }));
}

module.exports = { getAllProperties };