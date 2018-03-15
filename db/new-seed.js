const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const faker = require('faker');
const random = require('random-ext');
const Restaurants = require('./models/new-restaurant');

const dbAddress = process.env.DB_ADDRESS || 'localhost';
const url = `mongodb://${dbAddress}/wegot`;
mongoose.connect(url, { useMongoClient: true });

const db = mongoose.connection;
db.on('error', () => console.error('Error connecting to MongoDB'));

const limit = 10000;
let id = 0;

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
      random.integer(limit, 1),
      random.integer(limit, 1),
      random.integer(limit, 1),
      random.integer(limit, 1),
      random.integer(limit, 1),
      random.integer(limit, 1),
    ],
  };

  return doc;
};

const generateThousandArray = () => {
  const thousandDocuments = [];
  for (let i = 0; i < 1000; i += 1) {
    const item = generateDocument(id);
    thousandDocuments.push(item);
    id += 1;
  }
  return thousandDocuments;
};

const writeThousandToDb = async () => {
  const docs = generateThousandArray();
  return Restaurants.RestaurantModel.insertMany(docs);
};

db.on('open', () => {
  console.log('Connected to MongoDB!');
  const start = process.hrtime();

  Restaurants.RestaurantModel.count()
    .then((count) => {
      // console.log('Items in DB: ', count);
      if (count !== 0) {
        console.log('Drop current database before attempting to re-seed.');
        db.close();
        const end = process.hrtime(start);
        console.log(`${end}`);
      } else {
        // seedDb will have to return a promise
        writeThousandToDb()
          .then(() => {
            console.log('Seeding complete.');
            db.close();
            const end = process.hrtime(start);
            console.log(`${end}`);
          })
          .catch(err => console.error('Error calling seedDb: ', err));
      }
    })
    .catch(err => console.error(err));
});
