const random = require('random-ext');

const cities = [
  {
    name: 'San Francisco',
    state: 'CA',
    coordinates: ['37.', '122.'],
  },
  {
    name: 'Houston',
    state: 'TX',
    coordinates: ['29.', '95.'],
  },
  {
    name: 'Los Angeles',
    state: 'CA',
    coordinates: ['34.', '118.'],
  },
  {
    name: 'Albuquerque',
    state: 'NM',
    coordinates: ['35.', '106.650'],
  },
  {
    name: 'New York name',
    state: 'NY',
    coordinates: ['40.', '74.'],
  },
  {
    name: 'Chicago',
    state: 'IL',
    coordinates: ['41.', '87.'],
  },
  {
    name: 'Mandan',
    state: 'ND',
    coordinates: ['46.', '100.'],
  },
  {
    name: 'Mililani Town',
    state: 'HI',
    coordinates: ['21.', '158.'],
  },
  {
    name: 'Baton Rouge',
    state: 'LA',
    coordinates: ['30.', '91.'],
  },
  {
    name: 'Portland',
    state: 'OR',
    coordinates: ['45.', '122.'],
  },
  {
    name: 'Austin',
    state: 'TX',
    coordinates: ['30.', '97.'],
  },
  {
    name: 'Las Vegas',
    state: 'NV',
    coordinates: ['36.', '115.'],
  },
  {
    name: 'Miami',
    state: 'FL',
    coordinates: ['25.', '80.'],
  },
  {
    name: 'Denver',
    state: 'C0',
    coordinates: ['39.', '104.'],
  },
  {
    name: 'San Diego',
    state: 'CA',
    coordinates: ['32.', '117.'],
  },
  {
    name: 'Washington D.C.',
    state: '',
    coordinates: ['38.', '77.'],
  },
  {
    name: 'Boston',
    state: 'MA',
    coordinates: ['42.', '71.'],
  },
  {
    name: 'Philadelphia',
    state: 'PA',
    coordinates: ['39.', '75.'],
  },
  {
    name: 'Baltimore',
    state: 'MD',
    coordinates: ['39.', '76.'],
  },
  {
    name: 'Atlanta',
    state: 'GA',
    coordinates: ['33.', '84.'],
  },
];

const randomCoordinates = ([lat, long]) => {
  const coordinates = [];

  const adjustLatitude = random.integer(9999, 0);
  const adjustLongitude = random.integer(9999, 0);

  // Mongo expects [lng, lat]
  coordinates[1] = lat + adjustLatitude;
  coordinates[0] = long + adjustLongitude;

  return coordinates.map(str => parseFloat(str));
};

let test = randomCoordinates(cities[0].coordinates);
console.log(test);

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

