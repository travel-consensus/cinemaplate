var netflixRoulette = require('netflix-roulette');
var rp = require('request-promise');

var getNetflixByTitle = function(title){
  return netflixRoulette.title(title, function(error, data){
    if(error){
      console.log('error: ', error);
    }
    else {
      console.log('got netflix response: ', data)
    }
  });
}

var NetflixRoulettePromise = {
  options: function(title){
    var page = page ? page : 1;
    return {
        uri: 'http://netflixroulette.net/api/api.php',
        qs: {
            title: title // -> uri + '?access_token=xxxxx%20xxxxx' 
        },
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true // Automatically parses the JSON string in the response 
    };
  },
  title: function(title){
    var options = this.options(title);
    return rp(options)
      .then(function (response){
        console.log('netflix response: ', response);
      })
      .catch(function(error){
        console.log('error: ', error.error.message);
      });
  }
}


var MovieDB = {
  options: function(url, page){
    var page = page ? page : 1;
    return {
        uri: url,
        qs: {
            page: page,
            api_key: process.env.MOVIEDB_TOKEN // -> uri + '?access_token=xxxxx%20xxxxx' 
        },
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true // Automatically parses the JSON string in the response 
    };
  },

  genres: function(){
    var options = this.options('http://api.themoviedb.org/3/genre/movie/list');
    return rp(options)
        .then(function (response) {
          return response;
        })
        .catch(function (error) {
          console.log('error: ', error);
        });
  },

  getMoviesByGenreId: function(genreId, page){
    var options = this.options('http://api.themoviedb.org/3/genre/' + genreId + '/movies', page);
    return rp(options)
      .then(function(response) {
        return response;
      })
      .catch(function(error) {
        console.log('error: ', error);
      });
  }
};

// MovieDB.genres()
//   .then(function(response){
//     console.log('genres: ', response);
//   });

// MovieDB.getMoviesByGenreId(28, 49)
//   .then(function(response){
//     response.results.map(function(film){
//       console.log(film)
//     })
//   });
  
// NetflixRoulettePromise.title('Donnie Darko')
// .then(function(response){
//   console.log(response);
// })