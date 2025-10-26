const db = require("../../db/connection");

exports.fetchUserById = async (id) => {
  const query = `
    SELECT user_id, first_name, surname, email, phone_number, avatar, created_at
    FROM users
    WHERE user_id = $1;
  `;
  const { rows } = await db.query(query, [id]);
  return rows[0];
};