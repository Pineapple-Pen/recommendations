const random = require('random-ext');
const { db } = require('./db.js');

const findOne = async (id) => {
  const start = Date.now();

  const nearby = await db.any(`SELECT * FROM restaurants ORDER BY restaurants.geom <-> (SELECT geom FROM restaurants WHERE place_id = ${id}) LIMIT 6;`);

  const end = Date.now();
  console.log(`PostgreSQL (via pg-promise) returned one ${typeof nearby} in ${end - start} ms`);
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
