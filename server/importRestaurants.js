var yelp = require('./yelpHelp');
var pg = require('pg');


var pgConString = '';
if (process.env.NODE_ENV !== 'production') {
  // If trying to connect to DB remotely (ie, dev environment)
  // we need to add the ssl flag.
  pgConString = process.env.DATABASE_URL + '?ssl=true';
} else {
  pgConString = process.env.DATABASE_URL;
}


  var pgClient = new pg.Client(pgConString);
  pgClient.connect(function(err){
    if (err){
      return console.error('could not connect to postgres', err);
    }

      yelp.getFoodList().then(function(res){
      return res
      })
      .then(function(data){
      var counter = 0
      for (var key in data){
        if (data[key] !== undefined){
          var parsed = JSON.parse(JSON.stringify(data[key]))
          var keys = Object.keys(parsed)
          for (var i =0;i<keys.length;i++){
            counter++
            //preparing data for sql inserts
            // console.log(counter, ">>>", parsed[keys[i]].name)
            //temp values for inserting in db
           
              var restName = parsed[keys[i]].name
              // restDescription = parsed[keys[i]].snippet_text
              var restPhone = parsed[keys[i]].display_phone
              var restAddress = parsed[keys[i]].location.display_address
              var restZipCode = parsed[keys[i]].location.postal_code
              // restHours = parsed[keys[i]].
              // restPriceRange = parsed[keys[i]].
              var restImageUrl = parsed[keys[i]].image_url
              var restEat24Url = parsed[keys[i]].eat24_url
              var restYelpRating = parsed[keys[i]].rating
              var restYelpId = parsed[keys[i]].id
              var restCategories = []
              var restCategoriesLength = parsed[keys[i]].categories.length
              for (j=0;j<restCategoriesLength;j++){
                //push categories into temp array
                restCategories.push(parsed[keys[i]].categories[j][1])
              } 
                // console.log(restCategories)    
            pgClient.query('INSERT INTO "restaurants" (restaurant_name) VALUES (' + restName + ')', function (err, result){
              if (err){
                return console.error('error running query', err);
              }
              res.send(result.rows);
              pgClient.end();
            });
          }
        }
      }
    }
