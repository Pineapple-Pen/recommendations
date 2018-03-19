/*
  psql -h localhost -d postgres -p 5432 -a -q  -f ./db/postgres/INIT.sql
*/

-- terminate background users if any 
REVOKE CONNECT ON DATABASE wegot FROM public;
SELECT pid, pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE datname = current_database() AND pid <> pg_backend_pid();

DROP DATABASE IF EXISTS wegot;

CREATE DATABASE wegot;
-- connect
\c wegot; 

CREATE TABLE restaurants(
  id INT NOT NULL,
  rest_name TEXT,
  google_rating INT,
  zagat_food_rating INT,
  review_count INT,
  short_description TEXT,
  neighborhood TEXT,
  rest_address TEXT,
  website TEXT,
  price_level INT,
  latitude NUMERIC,
  longitude NUMERIC
);

CREATE TABLE types(
  id INT NOT NULL,
  rest_type TEXT
);

-- join table for rest and type
CREATE TABLE restaurant_types(
  rest_id INT,
  description_id INT
  -- FOREIGN KEY (rest_id) REFERENCES restaurants (id),
  -- FOREIGN KEY (description_id) REFERENCES types (id)
);

-- join table for rest and rest (nearby)
CREATE TABLE nearby(
  rest_id INT,
  nearby_id INT
  -- FOREIGN KEY (rest_id) REFERENCES restaurants (id)
  -- FOREIGN KEY (nearby_id) REFERENCES restaurants (id)
);

CREATE TABLE photos(
  rest_id INT,
  photo_url TEXT
  -- FOREIGN KEY (rest_id) REFERENCES restaurants (id)
);

