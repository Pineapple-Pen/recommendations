/*
  psql -h localhost -d postgres -p 5432 -a -q  -f ./db/postgres/INIT.sql
*/

-- terminate background users if any 
SELECT pid, pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE datname = current_database() AND pid <> pg_backend_pid();

DROP DATABASE IF EXISTS wegotgeo;

CREATE DATABASE wegotgeo;
-- connect
\c wegotgeo; 

CREATE EXTENSION postgis;

CREATE TABLE restaurants(
  place_id INT NOT NULL,
  rest_name TEXT,
  google_rating INT,
  zagat_food_rating INT,
  review_count INT,
  short_description TEXT,
  neighborhood TEXT,
  rest_address TEXT,
  website TEXT,
  price_level INT,
  rest_type TEXT,
  photo_1 TEXT,
  photo_2 TEXT,
  photo_3 TEXT,
  geom geometry(POINT, 4326)
);