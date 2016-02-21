var browserify = require('browserify-middleware');
var express = require('express');
var Path = require('path');
var pg = require('pg');
var yelp = require('./yelpHelp');
var sass = require('node-sass-endpoint');
var reddit = require('./redditHelp');
var movie = require('./movieHelp');
var sql = require('./sqlHelp');

//
// Get Postgres rolling.
var pgConString = '';
if (process.env.NODE_ENV !== 'production') {
  // If trying to connect to DB remotely (ie, dev environment)
  // we need to add the ssl flag.
  pgConString = process.env.DATABASE_URL + '?ssl=true';
} else {
  pgConString = process.env.DATABASE_URL;
}

pgClient = new pg.Client(pgConString)


var routes = express.Router();

//returns movie array of objects - [{},{},{}]
reddit.getMovies()
  .then(function(res){
    return movie.getMovieDB(res)})
  .then(function(movieData){
      // console.log('I am the response, do with me as you will',movieData)
      console.log("Total Movies Returned: ", movieData.length)

      var k;
      for (k=0;k<movieData.length;k++){
        (function(){
          console.log("Adding movie ", k+1, ">>>", movieData[k].title)

          sql.insertMovie(movieData[k].title, movieData[k].summary, movieData[k].url , movieData[k].img)
        })(k);
      }
      return movieData
  })



// //still need to fold into routes.get
yelp.getFoodByZip(78745)
.then(function(res){
    // console.log('i am the res', res); 
    return res
})
.then(function(data){

    console.log("Total Restaurants Returned: ", data.length)

    var i;
    for (i =0;i<data.length;i++){
      (function(){

      console.log("Adding restaurant ", i+1, ">>>", data[i].name)

      var restaurantCuisines = [];
      for (var j=0;j<data[i].categories.length;j++){
        restaurantCuisines.push(data[i].categories[j][1])
      }
      console.log(restaurantCuisines)

      sql.insertRestaurant(data[i].name, data[i].snippet_text, data[i].display_phone, data[i].location.display_address, data[i].location.postal_code, data[i].image_url, data[i].eat24_url, data[i].rating, data[i].id, restaurantCuisines)


      })(i);
    }
})
          //loop through each restaurant and get restaurant details

//       //preparing data for sql inserts
//       //temp values for inserting in db
        



//         };
// return data
// console.log('out DATA:', data)
//     });

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
  // Get first 3 zip digits for sql "like" query.
  var slimZip = zip.slice(0,3);
console.log("ZIP", zip)
  var pgClient = new pg.Client(pgConString);
  pgClient.connect(function(err){
    if (err){
      return console.error('could not connect to postgres', err);
    }
    pgClient.query("SELECT * FROM restaurants WHERE restaurant_zip LIKE '" + slimZip + "%' order by random() limit 10", function (err, result){
      if (err){
        return console.error('error running query', err);
      }
      else {
        console.log(result.rows)
        res.send(result.rows);
        pgClient.end();
      }
    });
  });
});

routes.get('/testing/movies', function(request, response){
  var movieData = sql.getAllMovies()
  response.send(movieData)

})

// routes.get('/testing/restaurants', function(request, response){
//   var restaurantsData = sql.getAllRestaurants()
//   response.send(restaurantsData)

// })



//
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
