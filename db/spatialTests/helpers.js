const random = require('random-ext');

const cities = [
  {
    name: 'San Francisco',
    state: 'CA',
    coordinates: ['37.7', '122.4'],
  }, // SF
  {
    name: 'Houston',
    state: 'TX',
    coordinates: ['29.7', '95.3'],
  },
  {
    name: 'Los Angeles',
    state: 'CA',
    coordinates: ['34.0', '118.2'],
  },
  {
    name: 'Albuquerque',
    state: 'NM',
    coordinates: ['35.0', '106.6504'],
  },
  {
    name: 'New York name',
    state: 'NY',
    coordinates: ['40.7', '74.0'],
  },
  {
    name: 'Chicago',
    state: 'IL',
    coordinates: ['41.8', '87.6'],
  },
  {
    name: 'Mandan',
    state: 'ND',
    coordinates: ['46.8', '100.8'],
  },
  {
    name: 'Mililani Town',
    state: 'HI',
    coordinates: ['21.4', '158.0'],
  },
  {
    name: 'Baton Rouge',
    state: 'LA',
    coordinates: ['30.4', '91.1'],
  },
  {
    name: 'Portland',
    state: 'OR',
    coordinates: ['45.5', '122.6'],
  },
  {
    name: 'Austin',
    state: 'TX',
    coordinates: ['30.2', '97.7'],
  },
  {
    name: 'Las Vegas',
    state: 'NV',
    coordinates: ['36.1', '115.1'],
  },
  {
    name: 'Miami',
    state: 'FL',
    coordinates: ['25.7', '80.1'],
  },
  {
    name: 'Denver',
    state: 'C0',
    coordinates: ['39.7', '104.9'],
  },
  {
    name: 'San Diego',
    state: 'CA',
    coordinates: ['32.7', '117.1'],
  },
  {
    name: 'Washington D.C.',
    state: '',
    coordinates: ['38.9', '77.0'],
  },
  {
    name: 'Boston',
    state: 'MA',
    coordinates: ['42.3', '71.0'],
  },
  {
    name: 'Philadelphia',
    state: 'PA',
    coordinates: ['39.9', '75.1'],
  },
  {
    name: 'Baltimore',
    state: 'MD',
    coordinates: ['39.2', '76.6'],
  },
  {
    name: 'Atlanta',
    state: 'GA',
    coordinates: ['33.7', '84.3'],
  },
];

const randomCoordinates = ([lat, long]) => {
  const coordinates = [];

  const adjustLatitude = random.integer(999, 0);
  const adjustLongitude = random.integer(999, 0);

  // Mongo expects [lng, lat]
  coordinates[1] = lat + adjustLatitude;
  coordinates[0] = long + adjustLongitude;

  return coordinates.map(str => parseFloat(str));
};

const types = [
  'Bar',
  'Restaurant',
  'Coffee Shop',
  'Diner',
  'Steakhouse',
  'Fast Food',
  'Tavern',
  'Pub',
  'Bakery',
  'Teahouse',
  'Casual',
];

const randomType = () => types[random.integer(types.length - 1, 0)];

exports.cities = cities;
exports.randomCoordinates = randomCoordinates;
exports.randomType = randomType;

// db.restaurants.createIndex( { location : "2dsphere" } )
// db.restaurants.find({location: { $near: { $geometry: { type: "Point", coordinates: [122.4194, 37.7749] } } } })
