/* eslint-disable no-await-in-loop */
/* eslint-disable max-len */
// const faker = require('faker');
const random = require('random-ext');
const _ = require('ramda');

const cluster = require('cluster');
const numCPUs = require('os').cpus().length; // 2 on my machine

const { db, pgp } = require('./db.js');
const gen = require('./dataGeneration.js');

const SEED_LIMIT = 40;
let id = process.env.forkID * (SEED_LIMIT / numCPUs);

// CREATE TYPES TABLE - ONE TIME OPERATION
const populateTypesTable = () => {
  const restaurantTypeColumnSet = new pgp.helpers.ColumnSet(['id', 'rest_type'], { table: 'types' });
  const restaurantTypeValues = gen.restaurantTypes.map((type, index) => (
    { id: index, rest_type: type }
  ));
  // generating a multi-row insert query:
  const restaurantTypeQuery = pgp.helpers.insert(restaurantTypeValues, restaurantTypeColumnSet);
  // => INSERT INTO "tmp"("col_a","col_b") VALUES('a1','b1'),('a2','b2')
  // executing the query:
  db.none(restaurantTypeQuery)
    .then(() => {
      console.log('Succesfully populated DB with restaurant types');
    })
    .catch((error) => {
      console.error(error);
    });
};

const seedDb = async () => {
  const start = process.hrtime();
  const restaurantsColumnSet = new pgp.helpers.ColumnSet(['id', 'rest_name', 'google_rating', 'zagat_food_rating', 'review_count', 'short_description', 'neighborhood', 'rest_address', 'website', 'price_level'], { table: 'restaurants' });
  const restaurantTypesColumnSet = new pgp.helpers.ColumnSet(['rest_id', 'description_id'], { table: 'restaurant_types' });
  const photosColumnSet = new pgp.helpers.ColumnSet(['rest_id', 'photo_urls'], { table: 'photos' });
  const nearbyRelationsColumnSet = new pgp.helpers.ColumnSet(['rest_id', 'nearby_ids'], { table: 'nearby' });

  let count = parseInt((SEED_LIMIT / numCPUs), 10);
  const size = 5;

  async function insertBulk() {
    // write restaurants
    const restaurants = _.range(0, size).map(() => {
      id += 1;
      return gen.makeSingleRestaurant(id - 1);
    });
    const restaurantQuery = pgp.helpers.insert(restaurants, restaurantsColumnSet);
    await db.none(restaurantQuery)
      .catch(err => console.log(err));
    // reset id
    id -= size;


    // Remaining tables depend on restaurant id's, so we write them afterward
    // Write 5 types per restaurant id
    const restaurantTypes = [];
    for (let i = 0; i < size; i += 1) {
      const randomStartingPoint = random.integer(10, 0);
      for (let j = 0; j < 5; j += 1) {
        restaurantTypes.push({ rest_id: id, description_id: randomStartingPoint + j });
      }
      id += 1;
    }
    const restaurantTypesQuery = pgp.helpers.insert(restaurantTypes, restaurantTypesColumnSet);
    await db.none(restaurantTypesQuery)
      .catch(err => console.log(err));
    // reset id
    id -= size;


    // write to photos table
    const photos = _.range(0, size).map(() => {
      id += 1;
      return gen.makePhotoURLsforSingleRestaurant(id - 1);
    });
    const photosQuery = pgp.helpers.insert(photos, photosColumnSet);
    await db.none(photosQuery)
      .catch(err => console.log(err));
    // reset id
    id -= size;


    // write to nearby table
    const nearbyRelations = _.range(0, size).map(() => {
      id += 1;
      return gen.makeNearbyRelationsForSingleRestaurant(id - 1);
    });
    const nearbyRelationsQuery = pgp.helpers.insert(nearbyRelations, nearbyRelationsColumnSet);
    await db.none(nearbyRelationsQuery)
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
  populateTypesTable(); // one time operation

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
