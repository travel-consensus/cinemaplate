var browserify = require('browserify-middleware');
var express = require('express');
var Path = require('path');
var pg = require('pg');
var yelp = require('./yelpHelp');
var sass = require('node-sass-endpoint');
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


//still need to fold into routes.get
yelp.getFoodByZip(78701)
.then(function(res){
    // console.log('i am the res', res); 
    return res
})
.then(function(data){
          //loop through each restaurant and get restaurant details
    console.log("Total Restaurants Returned: ", data.length)
    var i;
    for (i =0;i<data.length;i++){
      (function(){

       var restName = data[i].name
       var restDescription = data[i].snippet_text
       var restPhone = data[i].display_phone
       var restAddress = data[i].location.display_address
       var restZipCode = data[i].location.postal_code
       var restImageUrl = data[i].image_url
       var restEat24Url = data[i].eat24_url
       var restYelpRating = data[i].rating
       var restYelpId = data[i].id
       var restCuisinesLength = data[i].categories.length
       var restCuisines = []
       // var newRestaurantID

        // push categories into temp array
        for (var j=0;j<restCuisinesLength;j++){
          restCuisines.push(data[i].categories[j][1])
        }

        console.log(i+1, ">>>", data[i].name)
        // console.log(restCuisines)

      pgClient = new pg.Client(pgConString)
        pgClient.connect(function(err){
          if (err){
            return console.error('could not connect to postgres', err);
          }
          var sqlInsertRestaurants = 'INSERT INTO "restaurants" (restaurant_name,restaurant_description,restaurant_phone, restaurant_address,restaurant_zip,restaurant_image_url,restaurant_url, restaurant_yelp_rating, restaurant_yelp_id, restaurant_cuisines) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING restaurant_id'
          
          pgClient.query(sqlInsertRestaurants, [restName, restDescription, restPhone, restAddress, restZipCode, restImageUrl, restEat24Url, restYelpRating, restYelpId,restCuisines], function (err, result){
              if (err){
                return console.error('error running query', err);
              }
              else {

                var newRestaurantID = result.rows[0].restaurant_id
                 newRestaurantID
              }
                console.log("NEW RESTAURANT ID: ", newRestaurantID)
             

              
            })
                // pgClient.end();
          });


      })(i);

      //preparing data for sql inserts
      //temp values for inserting in db
        

          
              

        };
// return data
// console.log('out DATA:', data)
    });

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

  var pgClient = new pg.Client(pgConString);
  pgClient.connect(function(err){
    if (err){
      return console.error('could not connect to postgres', err);
    }
    pgClient.query('SELECT * FROM "genres"', function (err, result){
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


routes.get('/', function(req, res){
  res.sendFile( assetFolder + '/index.html' );
});

//
// Static assets (html, etc.)
//
var assetFolder = Path.resolve(__dirname, '../client/');
routes.use(express.static(assetFolder));


if (process.env.NODE_ENV !== 'test') {
  //
  // The Catch-all Route
  // This is for supporting browser history pushstate.
  // NOTE: Make sure this route is always LAST.
  //
  routes.get('/*', function(req, res){
    res.sendFile( assetFolder + 'index.html' );
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