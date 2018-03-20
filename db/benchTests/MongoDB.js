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
  };

  const findTen = async () => {
    for (let i = 0; i < 10; i += 1) {
      await findOne(random.integer(9999999, 1));
      console.log('between tests ...');
    }
  };

  const testSuite = async () => {
    try {
      await findOne(random.integer(9999999, 1));
      console.log('');

      const start = Date.now();
      await findTen();
      const end = Date.now();
      console.log(`MongoClient found ten records in ${end - start} ms`);
      process.exit();
    } catch (error) {
      console.error(error);
    }
  };

  testSuite();
});
