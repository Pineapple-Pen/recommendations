/* eslint-disable no-await-in-loop */
const random = require('random-ext');
const { db, pgp } = require('../postgres/db.js');

// one that awaits n db.find

// one that uses db.task

const findOne = async (id) => {
  const start = Date.now();

  const nearbyids = await db.any(`SELECT * FROM nearby WHERE rest_id = ${id}`);

  const docs = [];
  for (let i = 0; i < (1 || nearbyids.length); i += 1) {
    const restaurant = await db.one(`SELECT * FROM restaurants WHERE id = ${nearbyids[i].nearby_id}`);
    const photos = await db.any(`SELECT * FROM photos WHERE rest_id = ${nearbyids[i].nearby_id};`);
    const types = await db.any(`SELECT * FROM restaurant_types INNER JOIN types ON description_id = id WHERE rest_id = ${nearbyids[i].nearby_id};`);
    docs.push({ info: restaurant, photos, types });
  }
  const end = Date.now();
  console.log(`PostgreSQL (via pg-promise) returned one ${typeof docs} in ${end - start} ms`);
  return end - start;
};

const findMultiple = async (n) => {
  let sum = 0;
  for (let i = 0; i < n; i += 1) {
    const add = await findOne(random.integer(9999999, 1));
    sum += add;
  }
  return sum / n;
};

const testSuite = async () => {
  try {
    const n = 5000;
    const start = Date.now();
    const average = await findMultiple(n);
    const end = Date.now();
    console.log(`PostgreSQL (via pg-promise) found ${n} records with average speed of ${average} ms per record`);
    console.log(`Test completed in ${(end - start) / 1000} seconds`);
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

testSuite();
