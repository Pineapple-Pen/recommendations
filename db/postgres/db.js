const pgp = require('pg-promise')({
  capSQL: true,
});

const connection = 'postgres://localhost:5432/wegot';

const db = pgp(connection);

module.exports = {
  db,
  pgp,
};
