CREATE TABLE "Genre" (
  "genre_id" integer NOT NULL,
  "genre_name" varchar(100) NOT NULL,
  CONSTRAINT Genre_pk PRIMARY KEY ("genre_id")
);



CREATE TABLE "Movie" (
  "movie_id" integer NOT NULL,
  "movie_title" varchar(255) NOT NULL,
  "movie_summary" TEXT NOT NULL,
  "movie_rating" DECIMAL NOT NULL,
  "movie_release_year" integer(4) NOT NULL,
  "movie_director" varchar(255) NOT NULL,
  "movie_actors" TEXT NOT NULL,
  CONSTRAINT Movie_pk PRIMARY KEY ("movie_id")
);



CREATE TABLE "Restaurant" (
  "restaurant_id" integer NOT NULL,
  "restaurant_name" varchar(255) NOT NULL,
  "restaurant_description" TEXT NOT NULL,
  "restaurant_phone" varchar(15) NOT NULL,
  "restaurant_address" varchar NOT NULL,
  "restaurant_hours" varchar NOT NULL,
  "restaurant_price_range" varchar NOT NULL,
  "restaurant_image_url" TEXT NOT NULL,
  "restaurant_url" TEXT NOT NULL,
  "restaurant_yelp_rating" DECIMAL NOT NULL,
  CONSTRAINT Restaurant_pk PRIMARY KEY ("restaurant_id")
);



CREATE TABLE "RestaurantCuisine" (
  "restaurant_cuisine_id" integer NOT NULL,
  "fk_restaurant_id" integer NOT NULL REFERENCES Restaurant(restaurant_id) ON DELETE CASCADE,
  "fk_cuisine_id" integer NOT NULL REFERENCES Cuisine(cuisine_id) ON DELETE RESTRICT,
  CONSTRAINT RestaurantCuisine_pk PRIMARY KEY ("restaurant_cuisine_id")
);



CREATE TABLE "StreamingUrl" (
  "url_id" integer NOT NULL,
  "url" TEXT NOT NULL,
  "fk_movie_id" integer NOT NULL,
  CONSTRAINT StreamingUrl_pk PRIMARY KEY ("url_id"),
  CONSTRAINT StreamingUrl_fk0 FOREIGN KEY (fk_movie_id) REFERENCES Movie(movie_id)
);



CREATE TABLE "Cuisine" (
  "cuisine_id" integer NOT NULL,
  "cuisine_name" varchar(255) NOT NULL,
  CONSTRAINT Cuisine_pk PRIMARY KEY ("cuisine_id")
);



CREATE TABLE "MovieGenre" (
  "fk_movie_id" integer NOT NULL REFERENCES Movie(movie_id) ON DELETE CASCADE,
  "fk_genre_id" integer NOT NULL REFERENCES Genre(genre_id) ON DELETE RESTRICT,
  CONSTRAINT MovieGenre_pk PRIMARY KEY (fk_movie_id, fk_genre_id)
);



CREATE TABLE "CuisineGenre" (
  "fk_cuisine_id" integer NOT NULL,
  "fk_genre_id" integer NOT NULL,
  CONSTRAINT CuisineGenre_pk PRIMARY KEY (fk_cuisine_id, fk_genre_id),
  CONSTRAINT CuisineGenre_fk0 FOREIGN KEY (fk_cuisine_id) REFERENCES Cuisine(cuisine_id),
  CONSTRAINT CuisineGenre_fk1 FOREIGN KEY (fk_genre_id) REFERENCES Genre(genre_id)
);
