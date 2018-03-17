/* eslint-disable no-await-in-loop */
// const faker = require('faker');
// const random = require('random-ext');
const _ = require('ramda');

const cluster = require('cluster');
const numCPUs = require('os').cpus().length; // 2 on my machine

const { db, pgp } = require('./db.js');
const gen = require('./dataGeneration.js');

const SEED_LIMIT = 20;
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
  const restaurantColumnSet = new pgp.helpers.ColumnSet(['id', 'rest_name', 'google_rating', 'zagat_food_rating', 'review_count', 'short_description', 'neighborhood', 'rest_address', 'website', 'price_level'], { table: 'restaurants' });

  let count = parseInt((SEED_LIMIT / numCPUs), 10);
  const size = 5;

  async function insertBulk() {
    const restaurants = _.range(0, size).map(() => {
      id += 1;
      return gen.makeSingleRestaurant(id - 1);
    });

    const restaurantQuery = pgp.helpers.insert(restaurants, restaurantColumnSet);
    await db.none(restaurantQuery);
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


// CREATE TABLE types(
//   id INT PRIMARY KEY NOT NULL,
//   rest_type TEXT
// );

// -- join table for rest and type
// CREATE TABLE restaurant_types(
//   rest_id INT,
//   description_id INT,
//   FOREIGN KEY (rest_id) REFERENCES restaurants (id),
//   FOREIGN KEY (description_id) REFERENCES types (id)
// );

// -- join table for rest and rest (nearby)
// CREATE TABLE nearby(
//   rest_id INT,
//   nearby_id INT,
//   FOREIGN KEY (rest_id) REFERENCES restaurants (id),
//   FOREIGN KEY (nearby_id) REFERENCES restaurants (id)
// );

// CREATE TABLE photos(
//   rest_id INT,
//   link TEXT,
//   FOREIGN KEY (rest_id) REFERENCES restaurants (id)
// );


// // You can easily have some 10,000 objects like these:
// const users = [{ name: 'John', age: 23 }, { name: 'Mike', age: 30 }, { name: 'David', age: 18 }];

// db.tx((t) => {
//   const queries = users.map(u => t.none('INSERT INTO Users(name, age) VALUES(${name}, ${age})', u));
//   return t.batch(queries);
// })
//   .then((data) => {
//     // OK
//   })
//   .catch((error) => {
//     // Error
//   });

// // helpers.insert to build query strings
// const pgp = require('pg-promise')({
//   /* initialization options */
//   capSQL: true // capitalize all generated SQL
// });
// const db = pgp(/*connection*/);

// // our set of columns, to be created only once, and then shared/reused,
// // to let it cache up its formatting templates for high performance:
// const cs = new pgp.helpers.ColumnSet(['col_a', 'col_b'], {table: 'tmp'});

// // data input values:
// const values = [{col_a: 'a1', col_b: 'b1'}, {col_a: 'a2', col_b: 'b2'}];

// // generating a multi-row insert query:
// const query = pgp.helpers.insert(values, cs);
// //=> INSERT INTO "tmp"("col_a","col_b") VALUES('a1','b1'),('a2','b2')

// // executing the query:
// db.none(query)
//   .then(data => {
//       // success;
//   })
//   .catch(error => {
//       // error;
//   });


// RUN SEED PROCESSES:
if (cluster.isMaster) {
  console.log(`Master process ${process.pid} is running`);
  populateTypesTable();

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
