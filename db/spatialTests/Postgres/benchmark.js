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