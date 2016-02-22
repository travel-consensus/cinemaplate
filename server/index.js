var browserify = require('browserify-middleware');
var express = require('express');
var Path = require('path');
var pg = require('pg');
var yelp = require('./yelpHelp');
var sass = require('node-sass-endpoint');
var reddit = require('./redditHelp');
var movie = require('./movieHelp');

//
// Get Postgres rolling.
//
var pgConString = '';
if (process.env.NODE_ENV !== 'production') {
  // If trying to connect to DB remotely (ie, dev environment)
  // we need to add the ssl flag.
  pgConString = process.env.DATABASE_URL + '?ssl=true';
} else {
  pgConString = process.env.DATABASE_URL;
}

var routes = express.Router();

// returns movie array of objects - [{},{},{}]
reddit.getMovies()
  .then(function(res){
    return movie.getMovieDB(res)
  })
  .then(function(movieData){
      // console.log('I am the response, do with me as you will',movieData)
      // console.log("Total Movies Returned: ", movieData)

      var k;
      for (k=0;k<movieData.length;k++){
        (function(){
          var movieTitle = movieData[k].title
          var movieSummary = movieData[k].summary
          var movieUrl = movieData[k].url
          var movieImageUrl = movieData[k].img
          var movieRating = movieData[k].rating
          var movieReleaseDate = movieData[k].releaseDate
          var movieGenresArray = movieData[k].genreArray
          var movieGenres = ''
          // console.log(movieGenresArray.length)
          if (movieGenresArray.length>0) {
            for (var g=0;g<movieGenresArray.length;g++){
              (function(){

              })(g)
              var thisGenreID = movieData[k].genreArray[g]
              // console.log("GENRE ID: ", thisGenreID)
              var sqlGetMovieGenre = 'SELECT genre_name FROM "genres" WHERE genre_moviedb_id=' + thisGenreID

              pgClient.query(sqlGetMovieGenre, function(err, result){
                if (err){
                  return console.log("Error getting movie genre", err);
                }
                else {
                  movieGenres += result.rows[0].genre_name
                  // console.log("INITIAL: ", movieGenres)
                }

                var resultGenres = movieGenres.slice(0,-2)

              // console.log("RESULT GENRES: ", resultGenres)
              runInsertMovieQuery()
              })
              
            
            }
          }

          // pgClient = new pg.Client(pgConString)
          // pgClient.connect(function(err){
          // if (err){
          //   return console.error('could not connect to postgres', err);
          // }
          var runInsertMovieQuery = function(){
            
            var sqlInsertMovie = 'INSERT INTO "movies" (movie_title, movie_summary, movie_url, movie_image_url, movie_rating, movie_release_date, movie_genres) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING movie_id'
            
            pgClient.query(sqlInsertMovie, [movieTitle, movieSummary, movieUrl, movieImageUrl, movieRating, movieReleaseDate, movieGenres], function (err, result){
                if (err){
                  return console.log('error inserting movie', err);
                }
                else {

                  console.log("Adding movie >>>", movieTitle)
                  var newMovieID = result.rows[0].movie_id
                   newMovieID
                }
                  console.log("NEW MOVIE ID: ", newMovieID)
              })
          }
          // });
        })(k);
      }
      // return movieData
  })
            


//still need to fold into routes.get
yelp.getFoodByZip(78749)
.then(function(res){
//     // console.log('i am the res', res); 
    return res
})
.then(function(data){
          //loop through each restaurant and get restaurant details
    console.log("Total Restaurants Returned: ", data.length)
    console.log("Restaurant Object", data[0].location.city)
    var i;
    for (i =0;i<data.length;i++){
      (function(){

       var restName = data[i].name
       var restDescription = data[i].snippet_text
       var restPhone = data[i].display_phone
       var restStreetAddress = data[i].location.display_address[0]
       var restCity = data[i].location.city
       var restState = data[i].location.state_code
       var restZipCode = data[i].location.postal_code
       var restImageUrl = data[i].image_url
       var restEat24Url = data[i].eat24_url
       var restYelpRating = data[i].rating
       var restYelpId = data[i].id
       var restCuisinesLength = data[i].categories.length
       var restCuisines = ''
       // var newRestaurantID

        // push categories into temp array
        for (var j=0;j<restCuisinesLength;j++){
          restCuisines += (data[i].categories[j][0]) + ', '
        }

        console.log(i+1, ">>>", data[i].name)
        // console.log(restCuisines)
        // console.log(restCuisines.slice(0,-2))
        restCuisines = restCuisines.slice(0,-2)
        // if (restCuisines[restCuisines.length])

      pgClient = new pg.Client(pgConString)
        pgClient.connect(function(err){
          if (err){
            return console.log('could not connect to postgres', err);
          }
          var sqlInsertRestaurants = 'INSERT INTO "restaurants" (restaurant_name,restaurant_description,restaurant_phone, restaurant_street_address, restaurant_city, restaurant_state, restaurant_zip, restaurant_image_url, restaurant_url, restaurant_yelp_rating, restaurant_yelp_id, restaurant_cuisines) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING restaurant_id'
          
          pgClient.query(sqlInsertRestaurants, [restName, restDescription, restPhone, restStreetAddress, restCity, restState, restZipCode, restImageUrl, restEat24Url, restYelpRating, restYelpId, restCuisines], function (err, result){
              if (err){                 
                return console.log('error inserting restaurant.', err.message);
              }
              else {

                 if (result.rows[0].restaurant_id !== undefined){
                  var newRestaurantID = result.rows[0].restaurant_id
                  newRestaurantID
                 }
                  console.log("NEW RESTAURANT ID: ", newRestaurantID)
              }
            })
          });
      })(i);
    }
  })


//
// Provide a browserified file at a specified path
//
routes.get('/app-bundle.js', browserify('./client/app/app.js'));
routes.get('/css/app-bundle.css', sass.serve('./client/scss/app.scss'));

//
// Match endpoint to match movie genres with cuisines
//
routes.get('/api/match/:zip', function(req, res) {
  var zip = req.params.zip;
  // Get first 3 zip digits for SQL "like" query.
  var slimZip = zip.slice(0,3);

  var combinedResult = {};
  var pgClient = new pg.Client(pgConString);
  var restaurantQuery = pgClient.query("SELECT * FROM restaurants WHERE restaurant_zip LIKE '" + slimZip + "%' order by random() limit 1", function(err, result){
    return result;
  });
  restaurantQuery.on('end', function(result) {
    combinedResult.restaurant = result.rows[0];
  });
  var movieQuery = pgClient.query("SELECT * FROM movies order by random() limit 1", function(err, result){
    return result;
  });
  movieQuery.on('end', function(result) {
    combinedResult.movie = result.rows[0];
    res.send(combinedResult)
  });
  pgClient.on('drain', function() {
    pgClient.end();
  });
  pgClient.connect();
});


// Static assets (html, etc.)
//
var assetFolder = Path.resolve(__dirname, '../client');
routes.use(express.static(assetFolder));


if (process.env.NODE_ENV !== 'test') {
  //
  // The Catch-all Route
  // This is for supporting browser history pushstate.
  // NOTE: Make sure this route is always LAST.
  //
  routes.get('/*', function(req, res){
    res.sendFile( assetFolder + '/index.html' );
  });

  //
  // We're in development or production mode;
  // create and run a real server.
  //
  var app = express();

  // Parse incoming request bodies as JSON
  app.use( require('body-parser').json() );

  // Mount our main router
  app.use('/', routes);

  // Start the server!
  var port = process.env.PORT || 4000;
  app.listen(port);
  console.log("Listening on port", port);
}
else {
  // We're in test mode; make this file importable instead.
  module.exports = routes;
}