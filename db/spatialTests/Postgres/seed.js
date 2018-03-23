/* eslint-disable no-await-in-loop */
/* eslint-disable max-len */
const faker = require('faker');
const random = require('random-ext');
const _ = require('ramda');

const cluster = require('cluster');
const numCPUs = require('os').cpus().length; // 2 on my machine

const { db, pgp } = require('./db.js');
const data = require('../helpers.js');

const makeSingleRestaurant = (id) => {
  const city = data.cities[random.integer(data.cities.length - 1, 0)];
  const coordinates = data.randomCoordinates(city.coordinates);
  const restaurantObj = {
    place_id: id,
    rest_name: `${faker.random.words()} Cafe`,
    google_rating: random.integer(5, 1),
    zagat_food_rating: random.integer(5, 1),
    review_count: random.integer(50, 1),
    short_description: faker.lorem.sentences(),
    neighborhood: `${faker.name.lastName()} Hills`,
    rest_address: `${faker.address.streetAddress()}, ${city.name}, ${city.state}`,
    website: faker.internet.url(),
    price_level: random.integer(4, 1),
    photo_1: `https://picsum.photos/590/420?image=${random.integer(1000, 1)}`,
    photo_2: `https://picsum.photos/590/420?image=${random.integer(1000, 1)}`,
    photo_3: `https://picsum.photos/590/420?image=${random.integer(1000, 1)}`,
    type: data.randomType(),
    lng: coordinates[0],
    lat: coordinates[1]
  };

  return restaurantObj;
};

const SEED_LIMIT = 2;
let id = process.env.forkID * (SEED_LIMIT / numCPUs);

const seedDb = async () => {
  const start = process.hrtime();
  const restaurantsColumnSet = new pgp.helpers.ColumnSet([
    'place_id', 'rest_name', 'google_rating', 'zagat_food_rating', 'review_count', 'short_description', 
    'neighborhood', 'rest_address', 'website', 'price_level', 'photo_1', 'photo_2', 'photo_3',
    {
      name: 'geom',
      mod: ':raw',
      init: c => pgp.as.format('postgis.ST_GeomFromText(POINT(${lng}, ${lat}), 4326)', c.source)
    }
  ], { table: 'restaurants' });

  let count = parseInt((SEED_LIMIT / numCPUs), 10);
  const size = 1;

  async function insertBulk() {
    // write restaurants
    const restaurants = _.range(0, size).map(() => {
      id += 1;
      return makeSingleRestaurant(id - 1);
    });
    const restaurantQuery = pgp.helpers.insert(restaurants, restaurantsColumnSet);
    console.log(restaurantQuery);
    await db.none(restaurantQuery)
      .catch(err => console.log(err));

    count -= size;
    if (count > 0) {
      insertBulk();
    } else {
      console.log('Done in ', process.hrtime(start));
      process.exit();
    }
  }

  insertBulk();
};

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
  seedDb();
  console.log(`Worker ${process.pid} started: Fork ID ${process.env.forkID}`);
}
