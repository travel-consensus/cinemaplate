CREATE TABLE IF NOT EXISTS "genres" (
  "genre_id" SERIAL NOT NULL,
  "genre_name" varchar(100) NOT NULL,
  "genre_moviedb_id" INTEGER NOT NULL,
  CONSTRAINT genres_pk PRIMARY KEY ("genre_id")
);



CREATE TABLE IF NOT EXISTS "movies" (
  "movie_id" SERIAL NOT NULL,
  "movie_title" varchar(255) NOT NULL,
  "movie_summary" TEXT NOT NULL,
  "movie_rating" DECIMAL NOT NULL,
  "movie_release_year" integer NOT NULL,
  "movie_director" varchar(255) NOT NULL,
  "movie_actors" TEXT NOT NULL,
  CONSTRAINT movies_pk PRIMARY KEY ("movie_id")
);



CREATE TABLE IF NOT EXISTS "restaurants" (
  "restaurant_id" SERIAL NOT NULL,
  "restaurant_name" varchar(255) NOT NULL,
  "restaurant_description" TEXT,
  "restaurant_phone" varchar(15),
  "restaurant_address" varchar,
  "restaurant_zip" varchar,
  "restaurant_hours" varchar,
  "restaurant_price_range" varchar,
  "restaurant_image_url" TEXT,
  "restaurant_url" TEXT,
  "restaurant_yelp_rating" DECIMAL,
  "restaurant_yelp_id" VARCHAR UNIQUE,
  CONSTRAINT restaurants_pk PRIMARY KEY ("restaurant_id")
);



CREATE TABLE IF NOT EXISTS "cuisines" (
  "cuisine_id" SERIAL NOT NULL,
  "cuisine_name" varchar(255) NOT NULL,
  "cuisine_yelp_category_id" varchar(255) NOT NULL UNIQUE,
  CONSTRAINT cuisines_pk PRIMARY KEY ("cuisine_id")
);



CREATE TABLE IF NOT EXISTS "restaurantCuisines" (
  "restaurant_cuisine_id" SERIAL NOT NULL,
  "fk_restaurant_id" integer NOT NULL REFERENCES restaurants(restaurant_id) ON DELETE CASCADE,
  "fk_cuisine_id" integer NOT NULL REFERENCES cuisines(cuisine_id) ON DELETE RESTRICT,
  CONSTRAINT restaurantCuisines_pk PRIMARY KEY ("restaurant_cuisine_id")
);



CREATE TABLE IF NOT EXISTS "streamingUrls" (
  "url_id" SERIAL NOT NULL,
  "url" TEXT NOT NULL,
  "fk_movie_id" integer NOT NULL REFERENCES movies(movie_id),
  CONSTRAINT streamingUrls_pk PRIMARY KEY ("url_id"),
);



CREATE TABLE IF NOT EXISTS "movieGenres" (
  "fk_movie_id" integer NOT NULL REFERENCES movies(movie_id) ON DELETE CASCADE,
  "fk_genre_id" integer NOT NULL REFERENCES genres(genre_id) ON DELETE RESTRICT,
  CONSTRAINT movieGenres_pk PRIMARY KEY (fk_movie_id, fk_genre_id)
);



CREATE TABLE IF NOT EXISTS "pairings" (
  "pairing_id" SERIAL NOT NULL,
  "fk_movie_id" integer NOT NULL REFERENCES movies(movie_id),
  "fk_restaurant_id" integer NOT NULL REFERENCES restaurants(restaurant_id),
  CONSTRAINT pairings_pk PRIMARY KEY ("pairing_id")
);