var pg = require('pg');
var database = module.exports;

var pgConString = '';
if (process.env.NODE_ENV !== 'production') {
  // If trying to connect to DB remotely (ie, dev environment)
  // we need to add the ssl flag.
  pgConString = process.env.DATABASE_URL + '?ssl=true';
} else {
  pgConString = process.env.DATABASE_URL;
}

pgClient = new pg.Client(pgConString)

var database.insertRestaurant = function(restName, restDescription, restPhone, restAddress, restZipCode, restImageUrl, restEat24Url, restYelpRating, restYelpId, restCuisines){

  pgClient.connect(function(err){
    if (err){
      return console.log('Error: could not connect to postgres ', err);
    }
    var sqlInsertRestaurants = 'INSERT INTO "restaurants" (restaurant_name,restaurant_description,restaurant_phone, restaurant_address,restaurant_zip,restaurant_image_url,restaurant_url, restaurant_yelp_rating, restaurant_yelp_id, restaurant_cuisines) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING restaurant_id'
    
    pgClient.query(sqlInsertRestaurants, [restName, restDescription, restPhone, restAddress, restZipCode, restImageUrl, restEat24Url, restYelpRating, restYelpId, restCuisines], function (err, result){
        if (err){
          return console.log('Error: could not add restaurant ', err);
        }
        else {

          var newRestaurantID = result.rows[0].restaurant_id
           newRestaurantID
        }
        console.log("NEW RESTAURANT ID: ", newRestaurantID)
          pgClient.end();
       
      })
    });
};

var database.insertMovie = function(movieTitle, movieSummary, movieUrl, movieImageUrl){

  pgClient.connect(function(err){
    if (err){
      return console.log('Error: could not connect to postgres ', err);
    }
    var sqlInsertMovies = 'INSERT INTO "movies" (movie_title, movie_summary, movie_url, movie_image_url) VALUES ($1, $2, $3, $4) RETURNING movie_id'

    pgClient.query(sqlInsertMovies, [movieTitle, movieSummary, movieUrl, movieImageUrl], function(err, result){
      if (err){
        return console.log('Error: could not add movie ', err);
      }
      else {
        var newMovieID = result.rows[0].movie_id
        newMovieID
      }
      console.log("NEW MOVIE ID: ", newMovieID)
      pgClient.end()

    })
  });
      // done();

}

var database.getAllRestaurants = function(){
  pgClient.connect(function(err){
    if (err){
      return console.log('Error: could not connect to postgress ', err);
    }
    var sqlGetAllRestaurants = 'SELECT * FROM restaurants'

    pgClient.query(sqlGetAllRestaurants, function(err, result){
      if (err){
        return console.log('Error: could not get restaurants ', err);
      }
      else{
        return result.rows
        pgClient.end()

      }
    })
  })
}

var database.getAllMovies = function(){
  pgClient.connect(function(err){
    if (err){
      return console.log('Error: could not connect to postgress ', err);
    }
    var sqlGetAllMovies = 'SELECT * FROM movies'

    pgClient.query(sqlGetAllMovies, function(err, result){
      if (err){
        return console.log('Error: could not get movies ', err);
      }
      else{
        return result.rows
        pgClient.end()
      }
    })
  })
}
