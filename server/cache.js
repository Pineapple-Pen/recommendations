const Promise = require('bluebird');
const redis = require('redis');
// adds 'Async' to all node_redis functions (return client.getAsync().then())
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

const client = redis.createClient();
const { db, getRecommendations } = require('../db/postgres/db.js');
const quickSort = require('./quickSort');

const seedRedis = async() => {
  try {
    for (var i = 0; i < 100000; i += 1) {
      let recs = await getRecommendations(i, 10)
      quickSort(recs, 'zagat_food_rating', 1, recs.length - 1);
      recs = recs.slice(0, 7);
      // cache for 12 hours
      client.setex(i, 43200, JSON.stringify(recs), redis.print);
    }
    process.exit();
  } catch(error) {
    console.log('ERROR writing to Redis', error);
  }
}

client.on('connect', () => {
  seedRedis();
})

client.on('error', (err) => console.log(err));