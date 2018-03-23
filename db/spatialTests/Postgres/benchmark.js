/* eslint-disable no-await-in-loop */
const random = require('random-ext');
const { db, pgp } = require('../postgres/db.js');

const findOne = async (id) => {
  const start = Date.now();

  const nearby = await db.any(`SELECT * FROM restaurants ORDER BY restaurants.geom <-> (SELECT geom FROM restaurants WHERE place_id = ${id}) LIMIT 6;`);
  
  const end = Date.now();
  console.log(`PostgreSQL (via pg-promise) returned one ${typeof nearby} in ${end - start} ms`);
  return end - start;
};

const findMultiple = async (n) => {
  let sum = 0;
  for (let i = 0; i < n; i += 1) {
    const add = await findOne(random.integer(9999999, 1));
    sum += add;
  }
  return sum / n;
};

const testSuite = async () => {
  try {
    const n = 5000;
    const start = Date.now();
    const average = await findMultiple(n);
    const end = Date.now();
    console.log(`PostgreSQL (via pg-promise) found ${n} records with average speed of ${average} ms per record`);
    console.log(`Test completed in ${(end - start) / 1000} seconds`);
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

testSuite();
// findOne(4567);

/*
  postgres:
  SELECT ST_Distance(
  ST_GeographyFromText('POINT(-118.4079 33.9434)'), -- Los Angeles (LAX)
  ST_GeographyFromText('POINT(2.5559 49.0083)')     -- Paris (CDG)
  );

  SELECT *
  FROM your_table 
  ORDER BY your_table.geom <-> "your location..."
  LIMIT 5;
  ???

  SELECT name, gid
  FROM geonames
  ORDER BY geom <-> st_setsrid(st_makepoint(-90,40),4326)
  LIMIT 10;

  -- Closest 10 streets to Broad Street station are ?
  SELECT
    streets.gid,
    streets.name
  FROM
    nyc_streets streets
  ORDER BY
    streets.geom <->
    (SELECT geom FROM nyc_subway_stations WHERE name = 'Broad St')
  LIMIT 10;
  
  -- Same query using a geometry EWKT literal
  
  SELECT ST_AsEWKT(geom)
  FROM nyc_subway_stations
  WHERE name = 'Broad St';
  -- SRID=26918;POINT(583571 4506714)
  
  SELECT
    streets.gid,
    streets.name,
    ST_Distance(
      streets.geom,
      'SRID=26918;POINT(583571.905921312 4506714.34119218)'::geometry
      ) AS distance
  FROM
    nyc_streets streets
  ORDER BY
    streets.geom <->
    'SRID=26918;POINT(583571.905921312 4506714.34119218)'::geometry
  LIMIT 10;

*/