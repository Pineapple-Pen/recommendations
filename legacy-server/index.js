const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const restaurants = require('../db/models/new-restaurant.js');
const mongoose = require('mongoose');

// const dbAddress = process.env.DB_ADDRESS || 'localhost';

const url = 'postgres://localhost/wegotgeo';
mongoose.connect(url, { useMongoClient: true });

app.use(cors());
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, '../client/dist')));
app.use('/restaurants/:id', express.static(path.join(__dirname, '../client/dist')));

app.get('/api/restaurants/:id/recommendations', (req, res) => {
  const placeId = req.params.id || 0;
  console.log(`GET id = ${req.url}`);
  // find recommended restaurants based on id
  const results = [];
  restaurants.findOne(placeId, (err, data) => {
    if (err) {
      res.status(500);
      console.log(err);
    } else {
      console.log('restaurant info:', data);
      const nearbyArr = data[0].nearby;
      // console.log(nearbyArr);
      results.push(data[0]);

      restaurants.findMany(nearbyArr, (err, data) => {
        if (err) {
          res.status(500);
          console.log(err);
        } else {
          console.log('recommended restaurants:', data);
          results.push(data);
          // console.log("number of recommended: " + data.length);
          res.status(200);
          // res.send(data);
          // console.log(results.length);
          res.send(results);
        }
      });
    }
  });
});


app.listen(3004, () => { console.log('WeGot app listening on port 3004!'); });
