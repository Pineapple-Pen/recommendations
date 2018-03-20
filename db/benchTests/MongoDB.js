/* eslint-disable no-shadow */
/* eslint-disable no-await-in-loop */
// const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const random = require('random-ext');

const url = 'mongodb://localhost';

MongoClient.connect(url, (err, client) => {
  if (err) {
    console.error(err);
  }

  const db = client.db('wegot');
  const collection = db.collection('restaurants');

  const findOne = async (id) => {
    const start = Date.now();
    const doc = await collection.findOne({ place_id: id });
    const end = Date.now();
    console.log(`MongoClient found one ${typeof doc} in ${end - start} ms`);
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
      console.log(`MongoClient found ${n} records with average speed of ${average} ms per record`);
      console.log(`Test completed in ${end - start} ms`);
      process.exit();
    } catch (error) {
      console.error(error);
    }
  };

  testSuite();
});
