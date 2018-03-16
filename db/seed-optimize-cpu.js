/* eslint-disable no-await-in-loop */
const { MongoClient } = require('mongodb');
const faker = require('faker');
const random = require('random-ext');
const _ = require('ramda');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length; // 8

const SEED_LIMIT = 10000000;

// FUNCTION DEFINITIONS:
const generateDocument = (id) => {
  const doc = {
    name: `${faker.random.words()} Cafe`,
    place_id: id,
    google_rating: random.integer(5, 1),
    zagat_food_rating: random.integer(5, 1),
    review_count: random.integer(50, 1),
    // array of urls
    photos: [
      `https://picsum.photos/590/420?image=${random.integer(1000, 1)}`,
      `https://picsum.photos/590/420?image=${random.integer(1000, 1)}`,
      `https://picsum.photos/590/420?image=${random.integer(1000, 1)}`,
      `https://picsum.photos/590/420?image=${random.integer(1000, 1)}`,
      `https://picsum.photos/590/420?image=${random.integer(1000, 1)}`,
    ],
    short_description: faker.lorem.sentences(),
    neighborhood: `${faker.name.lastName()} Hills`,
    location: { lat: faker.address.latitude(), long: faker.address.longitude() },
    address: faker.fake('{{address.streetAddress}}, {{address.city}}, {{address.state}}, {{address.country}}'),
    website: faker.internet.url(),
    price_level: random.integer(4, 1),
    // array of words
    types: [
      faker.commerce.product(),
      faker.commerce.product(),
      faker.commerce.product(),
      faker.commerce.product(),
      faker.commerce.product(),
    ],
    // array of ids
    nearby: [
      random.integer(10000000, 1),
      random.integer(10000000, 1),
      random.integer(10000000, 1),
      random.integer(10000000, 1),
      random.integer(10000000, 1),
      random.integer(10000000, 1),
    ],
  };

  return doc;
};

let id = process.env.forkID * (SEED_LIMIT / numCPUs);
const url = 'mongodb://localhost/';

const oneMongoInsert = () => {
  const item = { insertOne: { document: generateDocument(id) } };
  id += 1;
  return item;
};

function seedDB() {
  MongoClient.connect(url, (err, client) => {
    if (err) {
      console.error(err);
    }
    const start = process.hrtime();
    const db = client.db('wegot');
    const collection = db.collection('restaurants');

    let count = parseInt((SEED_LIMIT / numCPUs), 10);
    const size = 1000;

    async function insertBulk() {
      const operations = _.range(0, size).map(oneMongoInsert);

      await collection.bulkWrite(operations, { ordered: false });
      count -= size;
      if (count > 0) {
        insertBulk();
      } else {
        console.log('Done in ', process.hrtime(start));
        client.close();
        process.exit();
      }
    }

    insertBulk();
  });
}

// RUN SEED PROCESSES:
if (cluster.isMaster) {
  console.log(`Master process ${process.pid} is running`);

  // Fork workers - on my machine this will generate 2
  for (let i = 0; i < numCPUs; i += 1) {
    cluster.fork({ forkID: i });
    // send env variables to fork
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} finished`);
  });
} else {
  seedDB();
  console.log(`Worker ${process.pid} started: Fork ID ${process.env.forkID}`);
}
