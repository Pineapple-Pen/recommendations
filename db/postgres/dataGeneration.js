const _ = require('ramda');
const faker = require('faker');
const random = require('random-ext');

const generateRestaurantTypes = () => {
  const uniqueTypes = {};

  for (let i = 0; i < 30; i += 1) {
    const type = faker.commerce.product();
    uniqueTypes[type] = true;
  }

  return _.keys(uniqueTypes);
};

const makeSingleRestaurant = (id) => {
  const restaurantObj = {
    id,
    rest_name: `${faker.random.words()} Cafe`,
    google_rating: random.integer(5, 1),
    zagat_food_rating: random.integer(5, 1),
    review_count: random.integer(50, 1),
    short_description: faker.lorem.sentences(),
    neighborhood: `${faker.name.lastName()} Hills`,
    rest_address: faker.fake('{{address.streetAddress}}, {{address.city}}, {{address.state}}, {{address.country}}'),
    website: faker.internet.url(),
    price_level: random.integer(4, 1),
  };

  return restaurantObj;
};

const makeSingleRestaurantTypes = (id, typeArray) => {
  const types = [];
  const len = typeArray.length;
  for (let i = 0; i < 5; i += 1) {
    types.push({ id, rest_type: typeArray[random.integer(len, 0)] });
  }
  return types;
};

exports.generateRestaurantTypes = generateRestaurantTypes;
exports.makeSingleRestaurant = makeSingleRestaurant;
exports.makeSingleRestaurantTypes = makeSingleRestaurantTypes;

