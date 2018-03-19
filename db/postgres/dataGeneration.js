const _ = require('ramda');
const faker = require('faker');
const random = require('random-ext');

const generateRestaurantTypes = () => {
  const uniqueTypes = {};

  for (let i = 0; i < 40; i += 1) {
    const type = faker.commerce.product();
    uniqueTypes[type] = true;
  }
  const array = _.keys(uniqueTypes).slice(0, 15);
  if (array.length !== 15) {
    return generateRestaurantTypes();
  }
  return array;
};

const restaurantTypes = generateRestaurantTypes();

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

const makeNearbyRelationsForSingleRestaurant = (id) => {
  const nearby = _.range(0, 6).map(() => random.integer(10000000, 1));
  return { rest_id: id, nearby_ids: nearby };
};

exports.restaurantTypes = restaurantTypes;
exports.makeSingleRestaurant = makeSingleRestaurant;
exports.makeSingleRestaurantTypes = makeSingleRestaurantTypes;
exports.makeNearbyRelationsForSingleRestaurant = makeNearbyRelationsForSingleRestaurant;

