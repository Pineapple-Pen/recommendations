/* eslint-disable no-shadow */
/* eslint-disable no-await-in-loop */
/* eslint-disable comma-dangle */
const { MongoClient } = require('mongodb');
const random = require('random-ext');

const url = 'mongodb://localhost';

MongoClient.connect(url, (err, client) => {
  if (err) {
    console.error(err);
  }

  const db = client.db('wegotGEO');
  const collection = db.collection('restaurants');

  const findOneResult = async (id) => {
    const start = Date.now();
    const doc = await collection.findOne({ place_id: id });
    const nearby = await collection.find({
      location: {
        $near: {
          $geometry:
          { type: 'Point', coordinates: doc.location.coordinates }
        }
      }
    }).limit(6).toArray();
    const end = Date.now();
    console.log(`MongoClient found ${nearby.length} nearby records for ID #${id} in ${end - start} ms`);
    return end - start;
  };

  const findMultiple = async (n) => {
    let sum = 0;
    for (let i = 0; i < n; i += 1) {
      const add = await findOneResult(random.integer(9999999, 1));
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
      console.log(`MongoClient executed ${n} queries with average speed of ${average} ms per record`);
      console.log(`Test completed in ${(end - start) / 1000} seconds`);
      process.exit();
    } catch (error) {
      console.error(error);
    }
  };

  testSuite();
});
