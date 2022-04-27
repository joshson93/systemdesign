DROP DATABASE IF EXISTS fennel;

CREATE DATABASE fennel;

\c fennel;

CREATE TABLE characteristics
(
  id INTEGER,
  product_id INTEGER,
  name VARCHAR(10)
);

CREATE TABLE reviews
(
  id SERIAL,
  product_id INTEGER,
  rating INTEGER,
  date BIGINT,
  summary VARCHAR(160) DEFAULT '',
  body VARCHAR(600),
  recommend BOOL,
  reported BOOL DEFAULT FALSE,
  reviewer_name VARCHAR(30),
  reviewer_email VARCHAR(40),
  response VARCHAR(150) DEFAULT '',
  helpfulness INTEGER DEFAULT 0
);

CREATE TABLE characteristic_reviews
(
  id INTEGER,
  characteristic_id INTEGER,
  review_id INTEGER,
  value INTEGER
);

CREATE TABLE reviews_photos
(
  id INTEGER,
  review_id INTEGER,
  url VARCHAR(400)
);

\COPY characteristics FROM '/home/ec2-user/seed/characteristics.csv' DELIMITERS ',' CSV header;
\COPY characteristic_reviews FROM '/home/ec2-user/seed/characteristic_reviews.csv' DELIMITERS ',' CSV header;
\COPY reviews_photos FROM '/home/ec2-user/seed/reviews_photos.csv' DELIMITERS ',' CSV header;
\COPY reviews FROM '/home/ec2-user/seed/reviews.csv' DELIMITERS ',' CSV header;

CREATE INDEX ON characteristics
(product_id);
CREATE INDEX ON characteristics
(id);
CREATE INDEX ON reviews
(product_id);
CREATE INDEX ON reviews
(id);
CREATE INDEX ON characteristic_reviews
(id);
CREATE INDEX ON characteristic_reviews
(review_id);
CREATE INDEX ON characteristic_reviews
(characteristic_id);
CREATE INDEX ON reviews_photos
(id);
CREATE INDEX ON reviews_photos
(review_id);

ALTER TABLE reviews
ADD COLUMN photos TEXT[];

UPDATE reviews SET photos = array(
SELECT reviews_photos.url
FROM reviews_photos
WHERE reviews_photos.review_id = reviews.id
);

ALTER TABLE reviews
ADD COLUMN characteristics_value INTEGER[];

UPDATE reviews SET characteristics_value = array(
SELECT characteristic_reviews.value
FROM characteristic_reviews
WHERE characteristic_reviews.review_id = reviews.id
);

ALTER TABLE reviews
ADD COLUMN characteristics_name CHARACTER VARYING;

UPDATE reviews SET characteristics_name = (
SELECT array_agg(characteristics.name)
FROM characteristics
WHERE characteristics.product_id = reviews.product_id
);

ALTER TABLE reviews
ADD COLUMN characteristics_id INTEGER[];

UPDATE reviews SET characteristics_id = (
SELECT array_agg(characteristics.id)
FROM characteristics
WHERE characteristics.product_id = reviews.product_id
);

SELECT pg_catalog.setval(pg_get_serial_sequence('reviews', 'id'), (SELECT MAX(id)
  FROM reviews)+1);

-- psql postgres -f schema.sql
-- psql -d fennel