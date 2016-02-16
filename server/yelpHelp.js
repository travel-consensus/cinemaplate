var Promise = require('bluebird')
var fs = Promise.promisifyAll(require('fs'));
var Yelp = require('node-yelp')

var client = Yelp.createClient({
  oauth: {
    "consumer_key": process.env.YELP_CONSUMER_KEY,
    "consumer_secret": process.env.YELP_CONSUMER_SECRET,
    "token": process.env.YELP_TOKEN,
    "token_secret": process.env.YELP_TOKEN_SECRET
  }
});

var yelp = module.exports;

var call1 = client.search({
  actionlinks: true,
  location: "78701",
  offset: 0
});

var call2 = client.search({
  actionlinks: true,
  location: "78701",
  offset: 20
});

var call3 = client.search({
  actionlinks: true,
  location: "78701",
  offset: 40
});

var call4 = client.search({
  actionlinks: true,
  location: "78701",
  offset: 60
});

var call5 = client.search({
  actionlinks: true,
  location: "78701",
  offset: 80
});

var call6 = client.search({
  actionlinks: true,
  location: "78701",
  offset: 100
});

var call7 = client.search({
  actionlinks: true,
  location: "78701",
  offset: 120
});

var call8 = client.search({
  actionlinks: true,
  location: "78701",
  offset: 140
});

var call9 = client.search({
  actionlinks: true,
  location: "78701",
  offset: 160
});

var call10 = client.search({
  actionlinks: true,
  location: "78701",
  offset: 180
});


yelp.getFoodList = function(){
  return Promise.all([call1, call2, call3, call4, call5, call6, call7, call8, call9, call10])
  .then(function(res){
    var eat24 = {}
    for(var x = 0; x < 10; x++){
        //boo quadratic
        eat24['nomnom' + x] = res[x].businesses.filter(function(y){
            return y.eat24_url !== undefined;
        })
    }
    return eat24;

  }).then(function(res){
      //return promise back to index.js 
      return res;
  })
  .catch(function(err){
    console.log('Error in yelp.getFoodList:', err)
  })
}

