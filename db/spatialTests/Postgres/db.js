const pgp = require('pg-promise')({
  capSQL: true,
});

const connection = 'postgres://localhost:5432/wegotgeo';

const db = pgp(connection);

module.exports = {
  db,
  pgp,
};
