// require('newrelic');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const Promise = require('bluebird');

const redis = require('redis');
// adds 'Async' to all node_redis functions (return client.getAsync().then())
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

const client = redis.createClient();

const { db, getRecommendations } = require('../db/postgres/db.js');
const quickSort = require('./quickSort');

// const dbAddress = process.env.DB_ADDRESS || 'localhost';
app.use(cors());
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, '../client/dist')));
app.use('/restaurants/:id', express.static(path.join(__dirname, '../client/dist')));

// check redis first
app.get('/api/restaurants/:id/recommendations', (req, res, next) => {
  const id = req.params.id || 0;
  
  client.getAsync(id)
    .then((reply) => {
      if (reply) {
        res.status(200);
        res.send(reply);
      } else {
        next();
      }
    })
    .catch(err => console.log(err))
});

app.get('/api/restaurants/:id/recommendations', (req, res) => {
  const id = req.params.id || 0;
  // find recommended restaurants based on id
  
  getRecommendations(id, 10)
    .then((recs) => {
      res.status(200);
      quickSort(recs, 'zagat_food_rating', 1, recs.length - 1);
      recs = recs.slice(0, 7);
      // cache for 1 hour
      client.setex(id, 3600, JSON.stringify(recs), redis.print);
      res.send(recs);
    })
    .catch((err) => {
      res.status(500);
      console.log(err);
    });
});

app.listen(3004, () => { console.log('WeGot app listening on port 3004!'); });
