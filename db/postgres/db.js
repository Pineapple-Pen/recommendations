require('dotenv').load();
const pgp = require('pg-promise')({
  capSQL: true,
});

const connection = process.env.RECOMMENDATIONS_DB;

const db = pgp(connection);

const getRecommendations = (id, limit) => {
  return db.any(`SELECT * FROM restaurants ORDER BY restaurants.geom <-> (SELECT geom FROM restaurants WHERE place_id = ${id}) LIMIT ${limit};`);
}

module.exports = {
  db,
  pgp,
  getRecommendations,
};
