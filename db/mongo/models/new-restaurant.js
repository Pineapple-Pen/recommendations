const mongoose = require('mongoose');

const restaurantSchema = mongoose.Schema({
  name: String,
  place_id: { type: Number, unique: true },
  google_rating: Number,
  zagat_food_rating: Number,
  review_count: Number,
  // array of urls
  photos: Array,
  short_description: String,
  neighborhood: String,
  location: { lat: Number, long: Number },
  address: String,
  website: String,
  price_level: Number,
  // array of words
  types: Array,
  // array of ids
  nearby: Array,
  latitude: Number,
  longitude: Number,
});

const RestaurantModel = mongoose.model('Restaurant', restaurantSchema);

// findAll retrieves all stories
function findAll(callback) {
  console.log('finding all!');
  RestaurantModel.find({}, callback);
}

// findOne will retrieve the restaurant associated with the given id
function findOne(id, callback) {
  console.log(`find ${id}`);
  RestaurantModel.find({ place_id: id }, callback);
  // RestaurantModel.find({place_id: 'ChIJFUBxSY6AhYARwOaLV7TsLjw'}, callback);
}

// insertOne inserts a restaurant into the db
function insertOne(restaurant, callback) {
  console.log('inserting one restaurant');
  RestaurantModel.create(restaurant, callback);
}

// retrieve many restaurants
function findMany(ids, callback) {
  console.log('FIND THESE IN DB: ', ids);
  RestaurantModel.find({ place_id: { $in: ids } }, callback);
}

exports.RestaurantModel = RestaurantModel;
exports.findOne = findOne;
exports.findAll = findAll;
exports.insertOne = insertOne;
exports.findMany = findMany;
