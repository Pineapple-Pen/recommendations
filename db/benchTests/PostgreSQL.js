/* eslint-disable no-await-in-loop */
const random = require('random-ext');
const { db, pgp } = require('../postgres/db.js');

// one that awaits n db.find

// one that uses db.task 

const findOne = async (id) => {
  const start = Date.now();

  const data = await db.any(`SELECT * FROM restaurants WHERE id = ${id}`);
  console.log(data);

  const end = Date.now();
  console.log(`PostgreSQL (via pg-promise) returned one ${typeof data} in ${end - start} ms`);
  return end - start;
};

findOne(79);
// const findMultiple = async (n) => {
//   let sum = 0;
//   for (let i = 0; i < n; i += 1) {
//     const add = await findOne(random.integer(9999999, 1));
//     sum += add;
//   }
//   return sum / n;
// };

// const testSuite = async () => {
//   try {
//     const n = 5000;
//     const start = Date.now();
//     const average = await findMultiple(n);
//     const end = Date.now();
//     console.log(`PostgreSQL (via pg-promise) found ${n} records with average speed of ${average} ms per record`);
//     console.log(`Test completed in ${(end - start) / 1000} seconds`);
//     process.exit();
//   } catch (error) {
//     console.error(error);
//   }
// };

// testSuite();
