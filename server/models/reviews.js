const db = require("../../db/connection");

exports.insertReview = async (propertyId, guestId, rating, comment) => {
  const query = `
    INSERT INTO reviews (property_id, guest_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *;`;
  const result = await db.query(query, [propertyId, guestId, rating, comment]);
  return result.rows[0];
};

exports.deleteReviewsByPropertyId = async (propertyId) => {
  const query = `DELETE FROM reviews WHERE property_id = $1 RETURNING *;`;
  const result = await db.query(query, [propertyId]);
  return result;
};

exports.fetchReviewsByPropertyId = async (propertyId) => {
  const query = `
    SELECT 
      reviews.review_id,
      reviews.comment,
      reviews.rating,
      reviews.created_at,
      users.first_name AS guest,
      users.avatar AS guest_avatar
    FROM reviews
    JOIN users ON reviews.guest_id = users.user_id
    WHERE reviews.property_id = $1
    ORDER BY reviews.created_at DESC;
  `;

  const result = await db.query(query, [propertyId]);
  return result.rows;
};